package com.example;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.*;
import org.apache.log4j.BasicConfigurator;

import java.util.Arrays;
import java.util.List;
import java.util.Properties;

public class FlatMap {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "keytable-example-app");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        BasicConfigurator.configure();

        StreamsBuilder builder = new StreamsBuilder();
        
        // Lire les messages depuis un topic Kafka
        KStream<String, String> sourceStream = builder.stream("input-topic");
        
        KStream<String, String> flatMappedStream = sourceStream.flatMap((key, value) -> {
            List<KeyValue<String, String>> keyValues = Arrays.asList(
                new KeyValue<>(key, value.toUpperCase()),
                new KeyValue<>(key, value.toLowerCase())
            );
            return keyValues;
        });
        flatMappedStream.to("flatmapped-topic", Produced.with(Serdes.String(), Serdes.String()));
                
        Topology t = builder.build();
        System.out.println(t.describe().toString());
    }
}
