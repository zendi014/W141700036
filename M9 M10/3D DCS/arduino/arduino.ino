//////////////////// LIBRARIES /////////////////////
#include <Arduino.h>
#include <Wire.h>

#include <ESP8266WiFi.h>
#include <SocketIoClient.h>
#include <ArduinoJson.h>

#include <Servo.h>


//////////////////// GLOBAL DEFINE /////////////////////
WiFiClient client;
SocketIoClient webSocket;

Servo srv1;
Servo srv2;

const char* ssid     = "i7559";
const char* password = "12345678";
char path[] = "/";
char host[] = "192.168.137.1";//WLAN IP (SERVER)
int port = 3000;




////////////////// LOOP AND SETUP ///////////////////////
void setup() {
    #if defined(ESP8266)
      Serial.begin(115200);
    #else
      Serial.begin(38400);
    #endif

    Serial.setDebugOutput(true);
    for(uint8_t t = 4; t > 0; t--) {
        Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
        Serial.flush();
        delay(500);
    }
    wifi_connection();
    webSocket.on("connect", connection);
    webSocket.begin(host, port);

    srv1.attach(D4);
    srv2.attach(D5);
}





void loop() {
    webSocket.loop();

    webSocket.on("update_pos", update_pos);
}




//////////////// BINDING CONNECTION /////////////////////
void wifi_connection(){
    Serial.print("\n");
    Serial.printf("WiFi Connecting to :: ");
    Serial.printf(ssid);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500); Serial.printf(".");
    }

    Serial.print("\n"); Serial.printf("WiFi connected");
    Serial.printf("IP address: ");
    Serial.print(WiFi.localIP());

    app_connection();
}





void app_connection(){
    Serial.print("\n");
    Serial.printf("App Connecting to :: ");
    Serial.printf(host);

    if (client.connect(host, port)) {
        Serial.printf("\nApp Server Connected\n");
    } else {
        Serial.printf("\nApp Server Connection failed\n");
    }

    Serial.print("");
}


void connection(const char * payload, size_t length) {

    webSocket.emit("connection", "ESP Connected");

}


//////////////// TRIGGER AND PARSE DATA /////////////////////
void update_pos(const char * payload, size_t length) {

    parse_data(payload);//parse data

}

void parse_data(String msg){
    StaticJsonBuffer<2048> JSONBuffer;//Memory pool
    JsonObject& parsed = JSONBuffer.parseObject(msg);

    if (parsed.success()) {
         StaticJsonBuffer<200> jsonBuffer;
         JsonObject& dt = jsonBuffer.createObject();
         float px = parsed["px"];
         float py = parsed["py"];
         float pz = parsed["pz"];

         tirgger_direct_pwm_value(px, py, pz);
    }
}




void tirgger_direct_pwm_value(double px, double py, double pz){
  float l1 = 2.75, l2 = 4.67;
  int q1 = 0, q2 = 0;
  double pi = 3.141592653589793; // (22/7)

  float s2 = pz/l2;
  float c2 = sqrt(1-(s2*s2));
  int t2 = atan2(s2, c2) / 2 / pi * 360;
  
  q2 = 90 + int(t2); //set initial position of the servo 2

  float a = (l1 + l2 * c2);
  float c1 = px / a;
  float s1 = py / a;
  int t1 = atan2(s1, c1) / 2 / pi * 360;

  q1 = 90 + int(t1);  //set initial position of the servo 1

  if(q1 <= 0){
    q1 = 0;
  }if(q1 >= 180){
    q1 = 180;
  }

  if(q2 <= 0){
    q2 = 0;
  }if(q2 >= 180){
    q2 = 180;
  }

  Serial.println("");
  Serial.print("q1:: ");Serial.println(q1);
  Serial.print("q2:: ");Serial.println(q2);

  srv1.write(int(q1));
  srv2.write(int(q2));
}










void broadcast_test(){
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& dt = jsonBuffer.createObject();
    dt["status"]  = "replying from WEMOS";
    dt["code"]  = "200";

    char jsondt[100];
    dt.printTo(jsondt);

            //dt.prettyPrintTo(Serial);
            //Serial.println(jsondt);
    webSocket.emit("res_web_app_soi", jsondt);//here replying
}
