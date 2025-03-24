package com.example;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.*;
import org.apache.log4j.BasicConfigurator;
import java.util.Properties;

public class Join {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "innerjoin-example-app");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        BasicConfigurator.configure();

        StreamsBuilder builder = new StreamsBuilder();
  
        // Définition des flux et tables
        KStream<String, String> orders = builder.stream("orders");
        KTable<String, String> customers = builder.table("customers");

        // Jointure interne : Ne garde que les commandes dont le client est connu
        KStream<String, String> enrichedOrders = orders.join(
            customers,
            (order, customer) -> "Commande: " + order + ", Client: " + customer
        );

        // Écriture du résultat dans un nouveau topic
        enrichedOrders.to("enriched-orders");

        Topology t = builder.build();
        System.out.println(t.describe().toString());
    }
}
