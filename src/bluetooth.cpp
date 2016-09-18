#include <Arduino.h>
#include <SoftwareSerial.h>

// This code uses the SoftwareSerial library.
// It can be obtained here: http://arduino.cc/en/Reference/SoftwareSerial

unsigned int timeout = 0;
unsigned char state = 0;

char val;        // variable to receive data from the serial port
int ledpin = 13; // LED connected to pin 13

void cleantime();
// Timer2 service
ISR(TIMER2_OVF_vect) {
  TCNT2 = 0;
  timeout++;
  if (timeout > 61) {
    state = 1;
    timeout = 0;
  }
}

// initialize the timer 2 service
void init_timer2(void) {
  TCCR2A |= (1 << WGM21) | (1 << WGM20);
  TCCR2B |= 0x07;     // by clk/1024
  ASSR |= (0 << AS2); // Use internal clock - external clock not used in Arduino
  TIMSK2 |= 0x01;     // Timer2 Overflow Interrupt Enable
  TCNT2 = 0;
  sei();
}

// sets up the program
void setup() {
  // open the serial port
  Serial.begin(9600);

  // bind the ledpin as output
  pinMode(ledpin, OUTPUT);

  // bind pin 2 as input
  pinMode(2, INPUT);
  pinMode(7, INPUT);
  // interrupt for reading from the bluetooth connection
  attachInterrupt(0, cleantime, FALLING);
  init_timer2();
}

// function for controlling the led
void control(void) {
  if (digitalRead(2) == HIGH) {
    Serial.println("Z");
  } else {
    Serial.print("[");
    Serial.print(analogRead(A0));
    Serial.print(", ");
    Serial.print(analogRead(A2));
    Serial.println("]");
  }
}

// control loop for the program
void loop() {
  control();
  delay(20);
}

void cleantime() {
  timeout = 0;
  state = 0;
}

// void serialEvent() {
//   while (Serial.available()) {
//     char inChar = (char)Serial.read();
//     Serial.println(inChar);
//   }
// }
