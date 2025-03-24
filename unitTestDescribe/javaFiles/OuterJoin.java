package com.example;

import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.Topology;
import org.apache.kafka.streams.kstream.*;
import org.apache.log4j.BasicConfigurator;
import java.util.Properties;

public class OuterJoin {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "outerjoin-example-app");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
        props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

        BasicConfigurator.configure();

        StreamsBuilder builder = new StreamsBuilder();
  
        // Définition des flux et tables
        KStream<String, String> orders = builder.stream("orders");
        KTable<String, String> customers = builder.table("customers");

        // Jointure externe : Inclut toutes les commandes et clients, même s'ils n'ont pas de correspondance
        KStream<String, String> enrichedOrders = orders.outerJoin(
            customers,
            (order, customer) -> "Commande: " + (order != null ? order : "Inconnu") + ", Client: " + (customer != null ? customer : "Inconnu")
        );

        // Écriture du résultat dans un nouveau topic
        enrichedOrders.to("enriched-orders");

        Topology t = builder.build();
        System.out.println(t.describe().toString());
    }
}
