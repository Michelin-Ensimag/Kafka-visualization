package com.example;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.*;
import org.apache.log4j.BasicConfigurator;

import java.util.Properties;

public class Merge {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "keytable-example-app");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        BasicConfigurator.configure();

        StreamsBuilder builder = new StreamsBuilder();
        
        KStream<String, String> streamIn_1 = builder.stream("TOPIC_A", Consumed.with(Serdes.String(), Serdes.String()));
        KStream<String, String> streamIn_2 = builder.stream("TOPIC_B", Consumed.with(Serdes.String(), Serdes.String())); 
        KStream<String, String> streamIn_3 = builder.stream("TOPIC_C", Consumed.with(Serdes.String(), Serdes.String())); 
        KStream<String, String> streamOut = streamIn_1.merge(streamIn_2).merge(streamIn_3); 
  
        streamOut.to("TOPIC_D", Produced.with(Serdes.String(), Serdes.String()));

        Topology t = builder.build();
        System.out.println(t.describe().toString());
    }
}
