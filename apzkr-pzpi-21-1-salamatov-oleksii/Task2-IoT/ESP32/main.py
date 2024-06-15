# Import libraries
import sonic_lib, oled_lib, machine
from machine import Pin, SoftI2C, PWM
from utime import sleep
from hx711 import HX711
from server_requests import get_data_from_server, post_data_to_server
import network

# Pin declaration 
trig = Pin(13, Pin.OUT)
echo = Pin(12, Pin.IN)

buzzer = Pin(21, Pin.OUT)

pin_oled = SoftI2C(scl=Pin(15), sda=Pin(2))

green_led = Pin(25, Pin.OUT)
yellow_led = Pin(26, Pin.OUT)
red_led = Pin(27, Pin.OUT)

red = Pin(23, Pin.OUT)
green = Pin(22, Pin.OUT)
red.value(0)
green.value(1)
button1 = machine.Pin(19, machine.Pin.IN, machine.Pin.PULL_UP)
button2 = machine.Pin(18, machine.Pin.IN, machine.Pin.PULL_UP)
button1_pressed = False

capteur_hx711 = HX711(33, 32, 1)

# Create name for libraries
screen = oled_lib.SSD1306_I2C(width=128, height=64, i2c=pin_oled)
jarak = sonic_lib.HCSR04(trigger_pin=trig, echo_pin=echo)

# Global variables
trash_type = 'plastic'
collection_point_id = 0
max_volume = 1000
bin_height = 200
ssid = 'Wokwi-GUEST'
server_url = "http://host.wokwi.internal:5048/"
condition = False

def connect_wifi(ssid):
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid)
    max_attempts = 10
    attempt = 0

    while not wlan.isconnected() and attempt < max_attempts:
        print(f"Attempt {attempt+1} to connect to Wi-Fi")
        sleep(1)
        attempt += 1

    if wlan.isconnected():
        print('Connected to Wi-Fi')
        print('Network config:', wlan.ifconfig())
    else:
        print('Failed to connect to Wi-Fi')
        raise RuntimeError('Wi-Fi connection failed')

def get_weight():
    capteur_hx711.power_on()
    while capteur_hx711.is_ready():
        pass

    measure = capteur_hx711.read(False)

    while capteur_hx711.is_ready():
        pass
    measure = capteur_hx711.read(True)

    # Calibration
    measure = measure / 420
    return measure

def define_fullness(distance):
    return round((1 - distance / bin_height) * 100)

def get_trash_volume(prev_distance, new_distance):
    trash_height = prev_distance - new_distance
    return max_volume * (trash_height / bin_height)

# Possible qr-code proceeding
def scan_qr_code():
    return '{"user_id": "1", "bearer_token": "abc"}'

# Function to process QR code data
def process_qr_data():
    qr_data = scan_qr_code()
    
    try:
        data = json.loads(qr_data)
    except ValueError:
        print("Error: Unable to decode JSON")
        return
    
    user_id = data.get("user_id")
    bearer_token = data.get("bearer_token")

    if not all([user_id, bearer_token]):
        print("Error: Missing required data")
        return

    # Verify the token
    if verify_token(bearer_token):
        print("Successful authentication of user with ID:", user_id)
        print("Bearer token:", bearer_token)
    else:
        print("Error: Invalid token")

# Attempt to connect to Wi-Fi
try:
    connect_wifi(ssid)  # Connect to Wi-Fi
except RuntimeError as e:
    print(e)

# Main Program
while True:
    # Ultrasonic program
    distance_in_cm = jarak.distance_cm()
    print('A garbage has been detected within:', distance_in_cm, 'cm')

    # OLED, Buzzer & Led 
    screen.fill(1)
    if distance_in_cm > 120:
        for a in range(10):
            Buzzer = PWM(buzzer, freq=1500, duty=0)
            green_led.on()
            yellow_led.off()
            red_led.off()

            screen.text('NOT FULL YET', 20, 5, 0)

    elif 50 <= distance_in_cm < 120:
        for a in range(10):
            Buzzer = PWM(buzzer, freq=1500, duty=0)
            green_led.off()
            yellow_led.on()
            red_led.off()

            screen.text('HALF THERE', 25, 5, 0)  

    else:
        for a in range(10):
            green_led.off()
            yellow_led.off()
            red_led.on()

            Buzzer = PWM(buzzer, freq=1500, duty=50)
            sleep(0.5)
            Buzzer = PWM(buzzer, freq=1500, duty=0)
            sleep(0.5)

            screen.text('BIN IS FULL,', 25, 15, 0)  
            screen.text('PLS EMPTY', 30, 30, 0)
    screen.text(f'Fullness: {str(define_fullness(distance_in_cm))}%', 12, 50, 0)    
    screen.show()

    if button1_pressed == False and distance_in_cm > 50:
        for a in range(15):
            screen.text('Hold green', 15, 30, 0)
            screen.text('button to start', 1, 40, 0)
            screen.show()

    if distance_in_cm >= 50 :
        user_id = None
        if button1.value() == 0:
            screen.fill(1)
            print('Enter user id')
            user_id = input()
            green.value(0)
            red.value(1)
            while button2.value() == 1:
                screen.text('Place the trash', 5, 20, 0)
                screen.text('Press red', 15, 38, 0)
                screen.text('button to finish', 1, 48, 0)
                screen.show()
        if button2.value() == 0:
            red.value(0)
            green.value(1)
            weight = get_weight()
            print("Total Weight is:", weight)
            if 1 < 0:
                # Create operation
                data_to_send = {
                    "trashType": trash_type,
                    "weight": weight,
                    "volume": get_trash_volume(distance_in_cm, jarak.distance_cm()),
                    "userID": user_id,
                    "collectionPointID": collection_point_id
                }

                response = post_data_to_server(f'{server_url}api/Operation/CreateOperation', data_to_send)
                if response:
                    print("Response from server:", response)
                else:
                    print("Failed to post data")

                if user_id != None:
                    # Get bonuses
                    data = get_data_from_server(f'https://localhost:7051/api/UserStatistics/GetUserBonuses/{user_id}')
                    if data is not None:
                        print("Received data:", data)
                        bonuses_amount = get_bonuses_amount(data)
                        if bonuses_amount is not None:
                            print("Amount of bonuses:", bonuses_amount)
                    else:
                        print("Failed to retrieve data")

            for a in range(10):
                screen.fill(1)
                screen.text(f'Weight: {weight:.2f} kg', 15, 40, 0)
                screen.show()
        

    sleep(0.5)
