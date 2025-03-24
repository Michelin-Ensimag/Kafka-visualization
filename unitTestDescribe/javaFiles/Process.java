package com.example;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.processor.api.Processor;
import org.apache.kafka.streams.processor.api.ProcessorContext;
import org.apache.kafka.streams.processor.api.ProcessorSupplier;
import org.apache.kafka.streams.processor.api.Record;
import org.apache.log4j.BasicConfigurator;

import java.util.Properties;

public class Process {
    public static void main(String[] args) {
        // Set up properties
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "keytable-example-app");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        // Configure logging
        BasicConfigurator.configure();

        // Build the stream processing topology
        StreamsBuilder builder = new StreamsBuilder();
        KStream<String, String> sourceStream = builder.stream("input-topic");

        // Apply a processor to the stream
        sourceStream.process(new ProcessorSupplier<String, String, String, String>() {
            @Override
            public Processor<String, String, String, String> get() {
                return new Processor<String, String, String,String>() {
                    @Override
                    public void init(ProcessorContext context) {
                    }


                    @Override
                    public void close() {
                        // Any cleanup logic can go here
                    }

                    @Override
                    public void process(Record<String, String> record) {
                        // TODO Auto-generated method stub
                        throw new UnsupportedOperationException("Unimplemented method 'process'");
                    }
                };
            }
        });

        // Build the topology
        Topology topology = builder.build();
        System.out.println(topology.describe().toString());
    }
}
