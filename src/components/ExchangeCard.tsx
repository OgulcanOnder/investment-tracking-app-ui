import { Card, Col, Flex, Row, Spin } from "antd";
import "../style/ExchangeCard.css";
import { Instruments } from "../data/Instruments";
import { getAllInstruments } from "../service/InstrumentService";
import { useState, useEffect } from "react";

const { Meta } = Card;

const ExchangeCard = () => {
  const [instruments, setInstruments] = useState<Instruments[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const results = await getAllInstruments();
        setInstruments(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstruments();
  }, []);
  useEffect(() => {}, [instruments]);

  const groupedInstruments = instruments.reduce(
    (acc, instrument) => {
      const type = instrument.type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(instrument);
      return acc;
    },
    {} as Record<string, Instruments[]>,
  );
  if (loading) {
    return (
      <Flex
        justify="center"
        align="center"
        style={{ padding: 48 }}
      >
        <Spin size="large" />
      </Flex>
    );
  }
  return (
    <div className="exchange-main">
      {Object.entries(groupedInstruments).map(([type, items]) => (
        <div key={type}>
          <div className="exchange-category">
            <h3>{type}</h3>
            <p className="category-border"></p>
          </div>
          <Row className="exchange-card-main">
            {items.map((instrument) => (
              <Col
                span={4}
                key={instrument.id}
              >
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      style={{ width: 240, height: 200 }}
                      src={instrument.imageUrl}
                      alt={instrument.name}
                    />
                  }
                >
                  <Meta
                    title={instrument.name}
                    description={`${instrument.price} ₺`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
};

export default ExchangeCard;
