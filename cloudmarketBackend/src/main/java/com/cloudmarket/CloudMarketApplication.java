package com.cloudmarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class CloudMarketApplication {

    public static void main(String[] args) {
        SpringApplication.run(CloudMarketApplication.class, args);
    }
}
