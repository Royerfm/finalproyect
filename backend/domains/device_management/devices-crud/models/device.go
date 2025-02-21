package models

import (
	_ "gorm.io/gorm"
)

type Device struct {
	ID             uint   `gorm:"primaryKey" json:"id"`
	SerialNumber   string `gorm:"type:varchar(255);uniqueIndex;null" json:"serial_number"`
	UserDevice     string `gorm:"type:varchar(255);not null" json:"user_device"`
	PasswordDevice string `gorm:"type:varchar(255);not null" json:"password_device"`
	NameDevice     string `gorm:"type:varchar(255);null" json:"name_device"`
	IPAddress      string `gorm:"type:varchar(255);not null" json:"ip_address"`
	RTSPPort       int    `gorm:"not null" json:"rtsp_port"`
	EmailUser      string `gorm:"type:varchar(255);not null" json:"email_user"`
}
