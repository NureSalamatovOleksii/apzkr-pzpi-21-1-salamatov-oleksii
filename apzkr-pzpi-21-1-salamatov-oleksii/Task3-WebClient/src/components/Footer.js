import React from "react";
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return(
        <div className="container">
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <p className="col-md-4 mb-0 text-muted">All rights reserved ©</p>
                <div className="col-md-4 d-flex justify-content-end">
                    <select onChange={(e) => changeLanguage(e.target.value)} className="form-select border-0">
                        <option value="en">EN</option>
                        <option value="ua">UA</option>
                    </select>
                </div>
            </footer>
        </div>
    );
}
