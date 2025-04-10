package com.example;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.processor.api.FixedKeyProcessor;
import org.apache.kafka.streams.processor.api.FixedKeyProcessorSupplier;
import org.apache.kafka.streams.processor.api.Processor;
import org.apache.kafka.streams.processor.api.ProcessorContext;
import org.apache.kafka.streams.processor.api.ProcessorSupplier;
import org.apache.kafka.streams.processor.api.Record;
import org.apache.kafka.streams.state.KeyValueStore;
import org.apache.kafka.streams.state.StoreBuilder;
import org.apache.kafka.streams.state.Stores;
import org.apache.log4j.BasicConfigurator;

import java.util.Properties;

public class TransformValues {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "keytable-example-app");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        BasicConfigurator.configure();

        StreamsBuilder builder = new StreamsBuilder();

        KStream<String, String> streamIn_1 = streamsBuilder.stream("TOPIC_A", Consumed.with(Serdes.String(), Serdes.String())); 
        KStream<String, String> streamOut = streamIn_1.transformValues(CustomTransformValues::new); 
        
        streamOut.to("TOPIC_D", Produced.with(Serdes.String(), Serdes.String()));

        Topology t = builder.build();
        System.out.println(t.describe().toString());
    }
}




