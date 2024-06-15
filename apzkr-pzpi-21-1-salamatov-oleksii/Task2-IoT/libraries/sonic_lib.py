from machine import Pin, time_pulse_us
from utime import sleep_us

class HCSR04:
    """
    Driver to use the untrasonic sensor HC-SR04.
    The sensor range is between 2cm and 4m.

    The timeouts received listening to echo pin are converted to OSError('Out of range')

    """
    # echo_timeout_us is based in chip range limit (400cm)
    def __init__(self, trigger_pin, echo_pin, echo_timeout_us=500*2*30):
        self.echo_timeout_us = echo_timeout_us
        # Init trigger pin (out)
        self.trigger = Pin(trigger_pin, mode=Pin.OUT, pull=None)
        self.trigger.value(0)

        # Init echo pin (in)
        self.echo = Pin(echo_pin, mode=Pin.IN, pull=None)

    # Send the pulse to trigger and listen on echo pin.
    # We use the method `machine.time_pulse_us()` to get the microseconds until the echo is received.
    def _send_pulse_and_wait(self):
        self.trigger.value(0) # Stabilize the sensor
        sleep_us(5)
        self.trigger.value(1)
        # Send a 10us pulse.
        sleep_us(10)
        self.trigger.value(0)
        try:
            pulse_time = time_pulse_us(self.echo, 1, self.echo_timeout_us)
         
            if pulse_time < 0:
                MAX_RANGE_IN_CM = const(500)
                pulse_time = int(MAX_RANGE_IN_CM * 29.1)
            return pulse_time
        except OSError as ex:
            if ex.args[0] == 110:
                raise OSError('Out of range')
            raise ex

    # Get the distance in milimeters without floating point operations.
    def distance_mm(self):
        pulse_time = self._send_pulse_and_wait()

        mm = pulse_time * 100 // 582
        return mm

    # Get the distance in centimeters with floating point operations.
    # It returns a float
    def distance_cm(self):
        pulse_time = self._send_pulse_and_wait()

        cms = (pulse_time / 2) / 29.1
        return cms
