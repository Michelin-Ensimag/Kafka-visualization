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
        
        // Lire les messages depuis un topic Kafka
        KStream<String, String> sourceStream = builder.stream("input-topic");
        
        // split d'abord
        KStream<String, String>[] branches = sourceStream.branch(
            (key, value) -> value.contains("error"),
            (key, value) -> value.contains("warning"),
            (key, value) -> true
        );
        //branches[0].to("error-topic", Produced.with(Serdes.String(), Serdes.String()));
        //branches[1].to("warning-topic", Produced.with(Serdes.String(), Serdes.String()));
        //branches[2].to("info-topic", Produced.with(Serdes.String(), Serdes.String()));

        // merge
        KStream<String, String> mergedStream = branches[0].merge(branches[1]).merge(branches[2]);
        mergedStream.to("merged-topic", Produced.with(Serdes.String(), Serdes.String()));
        
        
        Topology t = builder.build();
        System.out.println(t.describe().toString());
    }
}
