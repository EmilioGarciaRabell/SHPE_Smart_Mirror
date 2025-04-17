from gpiozero import LED
import sys
import time 

# Setup
LED_PIN = 18  # Replace with the GPIO pin connected to your LED
led = LED(LED_PIN)

# Control the LED based on the argument passed
if len(sys.argv) > 1:
    command = sys.argv[1]
    if command == "on":
        led.on()
        print("LED turned on")
        time.sleep(1)  # Keep the LED on for 1 second
        
    elif command == "off":
        led.off()
        print("LED turned off")
    else:
        print("Invalid command")
else:
    print("No command provided")

# Cleanup
led.close()

# useful video
# https://www.youtube.com/watch?v=9hsGI7PSSfI