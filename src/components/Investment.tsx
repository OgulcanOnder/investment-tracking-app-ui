import "../style/Investment.css";
import "../style/AddInvestmentDrawer.css";
import { EditOutlined, DeleteOutlined, PictureOutlined, PlusOutlined, SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Divider, Drawer, Flex, Form, Input, InputNumber, Modal, notification, Spin, Typography } from "antd";
import { InvestmentDTO, LatestInvestmentResponse } from "../data/Investment";
import { Instruments } from "../data/Instruments";
import { useEffect, useState } from "react";
import { getAllSummaryInvestment, getAllTotalInvestment, createInvestment, updateInvestment, deleteInvestment, getLatestInvestmentByInstrumentsId } from "../service/InvestmentService";
import { getAllInstruments } from "../service/InstrumentService";

const { Text } = Typography;

const formatCurrency = (value: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);

interface InvestmentCardProps {
  data: InvestmentDTO;
  onEdit: (investment: InvestmentDTO) => void;
  onDelete: (instrumentId: number) => void;
}

const InvestmentCard = ({ data, onEdit, onDelete }: InvestmentCardProps) => {
  const isProfitable = (data.profitLoss ?? 0) >= 0;

  return (
    <Card
      className={"card"}
      styles={{ body: { padding: 16 } }}
    >
      <Flex
        gap={14}
        align="flex-start"
      >
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt={data.instrumentsName}
            style={{
              width: 90,
              height: 90,
              objectFit: "contain",
              borderRadius: 8,
              border: "1.5px solid var(--ant-color-border)",
              flexShrink: 0,
            }}
          />
        ) : (
          <div className={"image-placeholder"}>
            <PictureOutlined className={"image-icon"} />
            <span>Resim</span>
          </div>
        )}

        <Flex
          vertical
          flex={1}
        >
          <Text className={"title"}>{data.instrumentsName}</Text>

          <div className={"meta-row"}>
            <span className={"label"}>Adet</span>
            <Text className={"value"}>{data.totalQuantity}</Text>
          </div>

          <div className={"meta-row"}>
            <span className={"label"}>Güncel Fiyat</span>
            <Text className={"value"}>{formatCurrency(data.currentPrice)}</Text>
          </div>

          <div className={"meta-row"}>
            <span className={"label"}>Ortalama Maliyet</span>
            <Text className={"value"}>{formatCurrency(data.averageCost)}</Text>
          </div>

          <div className={"meta-row"}>
            <span className={"label"}>Kâr / Zarar</span>
            <Text
              className={"value"}
              style={{ color: isProfitable ? "#1D9E75" : "#D85A30" }}
            >
              {isProfitable ? "+" : ""}
              {formatCurrency(data.profitLoss ?? 0)} ({isProfitable ? "+" : ""}
              {(data.profitLossPercent ?? 0).toFixed(1)}%)
            </Text>
          </div>
        </Flex>
      </Flex>

      <Divider style={{ margin: "12px 0" }} />

      <div className={"total-row"}>
        <span className={"total-label"}>Toplam Tutar</span>
        <Text className={"total-value"}>{formatCurrency(data.totalValue)}</Text>
      </div>

      <Flex
        gap={8}
        style={{ marginTop: 12 }}
      >
        <Button
          className={"edit-btn"}
          icon={<EditOutlined />}
          onClick={() => onEdit(data)}
        >
          Düzenle
        </Button>
        <Button
          className={"delete-btn"}
          icon={<DeleteOutlined />}
          onClick={() => onDelete(data.instrumentsId)}
        >
          SİL
        </Button>
      </Flex>
    </Card>
  );
};

export { InvestmentCard };

interface AddInvestmentDrawerProps {
  onSuccess: () => void;
}

const AddInvestmentDrawer = ({ onSuccess }: AddInvestmentDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<Instruments | null>(null);
  const [instruments, setInstruments] = useState<Instruments[]>([]);
  const [filtered, setFiltered] = useState<Instruments[]>([]);
  const [loadingInstruments, setLoadingInstruments] = useState(false);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    const fetch = async () => {
      setLoadingInstruments(true);
      try {
        const data = await getAllInstruments();
        setInstruments(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInstruments(false);
      }
    };
    fetch();
  }, [open]);

  useEffect(() => {
    const q = (search || "").toLowerCase();
    setFiltered(
      instruments.filter((i) => {
        const nameMatch = (i.name || "").toLowerCase().includes(q);
        const typeMatch = (i.type || "").toLowerCase().includes(q);
        const apiSymbolMatch = (i.apiSymbol || "").toLowerCase().includes(q);

        return nameMatch || typeMatch || apiSymbolMatch;
      }),
    );
  }, [search, instruments]);

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setSearch("");
    form.resetFields();
  };

  const handleSubmit = async (values: { quantity: number; buyPrice: number }) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await createInvestment({
        instrumentsId: selected.id,
        quantity: values.quantity,
        buyPrice: values.buyPrice,
      });
      handleClose();
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        className="trigger-btn"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
      >
        Yatırım Ekle
      </Button>

      <Drawer
        title="Yatırım Ekle"
        placement="right"
        width={400}
        open={open}
        onClose={handleClose}
        styles={{
          body: { padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 },
          header: { borderBottom: "1px solid var(--ant-color-border-secondary)" },
        }}
      >
        <div>
          <p className="section-label">Yatırım Türü</p>

          {selected && (
            <div className="selected-badge">
              <Avatar
                src={selected.imageUrl}
                size={24}
              />
              <Text style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{selected.name}</Text>
              <Text style={{ fontSize: 12 }}>₺{selected.price?.toLocaleString("tr-TR")}</Text>
            </div>
          )}

          <Input
            className="search-input"
            placeholder="Ara..."
            prefix={<SearchOutlined style={{ color: "var(--ant-color-text-tertiary)" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loadingInstruments ? (
            <Flex
              justify="center"
              style={{ padding: 24 }}
            >
              <Spin />
            </Flex>
          ) : (
            <div className="instrument-list">
              {filtered.map((inst) => (
                <div
                  key={inst.id}
                  className={`instrument-item ${selected?.id === inst.id ? "selected" : ""}`}
                  onClick={() => setSelected(inst)}
                >
                  <Avatar
                    src={inst.imageUrl}
                    size={32}
                  />
                  <Flex
                    vertical
                    gap={2}
                    flex={1}
                  >
                    <span className="instrument-name">{inst.name}</span>
                    <span className="instrument-type">{inst.type}</span>
                  </Flex>
                  <span className="instrument-price">₺{inst.price?.toLocaleString("tr-TR")}</span>
                </div>
              ))}
              {filtered.length === 0 && (
                <Flex
                  justify="center"
                  style={{ padding: 16 }}
                >
                  <Text
                    type="secondary"
                    style={{ fontSize: 13 }}
                  >
                    Sonuç bulunamadı
                  </Text>
                </Flex>
              )}
            </div>
          )}
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label={<span className="section-label">Yatırım Adeti</span>}
            name="quantity"
            rules={[
              { required: true, message: "Lütfen adet giriniz." },
              { type: "number", min: 0.000001, message: "0'dan büyük olmalıdır." },
            ]}
            style={{ marginBottom: 16 }}
          >
            <InputNumber
              className="number-input"
              placeholder="0"
              decimalSeparator=","
              min={0}
              step={1}
            />
          </Form.Item>

          <Form.Item
            label={<span className="section-label">Alım Fiyatı (₺)</span>}
            name="buyPrice"
            rules={[
              { required: true, message: "Lütfen alım fiyatı giriniz." },
              { type: "number", min: 0.01, message: "En az 0,01 olmalıdır." },
            ]}
            style={{ marginBottom: 16 }}
          >
            <InputNumber
              className="number-input"
              placeholder="0,00"
              decimalSeparator=","
              precision={2}
              min={0.01}
              step={0.01}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="submit-btn"
              loading={submitting}
              disabled={!selected}
            >
              Yatırım Ekle
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

interface EditInvestmentDrawerProps {
  investment: InvestmentDTO | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditInvestmentDrawer = ({ investment, onClose, onSuccess }: EditInvestmentDrawerProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<Instruments | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<LatestInvestmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!investment) return;
    let cancelled = false;
    const init = async () => {
      setLoading(true);
      try {
        const data = await getAllInstruments();
        if (cancelled) return;
        const match = data.find((i: Instruments) => i.name === investment.instrumentsName);
        if (match) setSelected(match);
        const latest = await getLatestInvestmentByInstrumentsId(investment.instrumentsId);
        if (cancelled) return;
        setSelectedRecord(latest);
      } catch (err) {
        notification.error({
          message: "Hata",
          description: err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu",
          placement: "topRight",
          duration: 3,
        });
        if (!cancelled) console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init();

    return () => {
      cancelled = true;
    };
  }, [investment]);

  useEffect(() => {
    if (!selectedRecord) return;
    form.setFieldValue("quantity", selectedRecord.quantity);
    form.setFieldValue("buyPrice", selectedRecord.buyPrice);
  }, [form, selectedRecord]);

  const handleClose = () => {
    setSelected(null);
    setSelectedRecord(null);
    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values: { quantity: number; buyPrice: number }) => {
    if (!selected || !selectedRecord) return;
    setSubmitting(true);
    try {
      await updateInvestment(selectedRecord.id, {
        instrumentsId: selected.id,
        quantity: values.quantity,
        buyPrice: values.buyPrice,
      });
      handleClose();
      onSuccess();
      notification.success({
        message: "Başarılı",
        description: "Yatırım başarıyla düzenlendi",
      });
    } catch (err) {
      notification.error({
        message: "Hata",
        description: err instanceof Error ? err.message : "Yatırım düzenlenirken beklenmeyen bir hata oluştu",
        placement: "topRight",
        duration: 3,
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title="Yatırımı Düzenle"
      placement="right"
      width={400}
      open={!!investment}
      onClose={handleClose}
      styles={{
        body: { padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 },
        header: { borderBottom: "1px solid var(--ant-color-border-secondary)" },
      }}
    >
      <div>
        <p className="section-label">Yatırım Türü</p>

        {selected && (
          <div className="selected-badge">
            <Avatar
              src={selected.imageUrl}
              size={24}
            />
            <Text style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{selected.name}</Text>
            <Text style={{ fontSize: 12 }}>₺{selected.price?.toLocaleString("tr-TR")}</Text>
          </div>
        )}
      </div>

      {loading ? (
        <Spin />
      ) : (
        <>
          <div>
            <p className="section-label">Düzenlenecek Kayıt</p>
            {selectedRecord && (
              <div
                key={selectedRecord.id}
                style={{
                  padding: "10px 12px",
                  marginBottom: 8,
                  borderRadius: 8,
                  border: `1px solid ${selectedRecord?.id ? "var(--ant-color-primary)" : "var(--ant-color-border-secondary)"}`,
                  cursor: "pointer",
                }}
              >
                <Text
                  type="secondary"
                  style={{ fontSize: 12 }}
                >
                  {selectedRecord.buyDate && new Date(selectedRecord.buyDate).toLocaleDateString("tr-TR")}
                </Text>
                <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                  <Text style={{ fontSize: 13 }}>Adet: {selectedRecord.quantity}</Text>
                  <Text style={{ fontSize: 13 }}>Fiyat: ₺{selectedRecord.buyPrice.toLocaleString("tr-TR")}</Text>
                </div>
              </div>
            )}
          </div>
          {selectedRecord && (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                label={<span className="section-label">Yatırım Adeti</span>}
                name="quantity"
                rules={[
                  { required: true, message: "Lütfen adet giriniz." },
                  { type: "number", min: 0.000001, message: "0'dan büyük olmalıdır." },
                ]}
                style={{ marginBottom: 16 }}
              >
                <InputNumber
                  className="number-input"
                  decimalSeparator=","
                  min={0}
                  step={1}
                />
              </Form.Item>

              <Form.Item
                label={<span className="section-label">Alım Fiyatı (₺)</span>}
                name="buyPrice"
                rules={[
                  { required: true, message: "Lütfen alım fiyatı giriniz." },
                  { type: "number", min: 0.01, message: "En az 0,01 olmalıdır." },
                ]}
                style={{ marginBottom: 16 }}
              >
                <InputNumber
                  className="number-input"
                  decimalSeparator=","
                  precision={2}
                  min={0.01}
                  step={0.01}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="submit-btn"
                  loading={submitting}
                  disabled={!selected}
                >
                  Güncelle
                </Button>
              </Form.Item>
            </Form>
          )}
        </>
      )}
    </Drawer>
  );
};

const Investment = () => {
  const [investments, setInvestments] = useState<InvestmentDTO[]>([]);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [editingInvestment, setEditingInvestment] = useState<InvestmentDTO | null>(null);

  const fetchInvestments = async () => {
    try {
      const results = await getAllSummaryInvestment();
      setInvestments(results);
      const totalResults = await getAllTotalInvestment();
      setTotalInvestment(totalResults);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleDelete = (instrumentsId: number) => {
    Modal.confirm({
      title: "Yatırımı sil",
      icon: <ExclamationCircleOutlined />,
      content: "Bu yatırımı silmek istediğinizden emin misiniz?",
      okText: "Sil",
      okType: "danger",
      cancelText: "Vazgeç",
      onOk: async () => {
        try {
          await deleteInvestment(instrumentsId);
          fetchInvestments();
        } catch {}
      },
    });
  };

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
    <div className="investment-main">
      <div className="total-main">
        <h3>TOPLAM VARLIKLAR</h3>
        <p>{formatCurrency(totalInvestment)}</p>
      </div>

      <div className="investment-title">
        <h4>PORTFÖY DAĞILIMI</h4>
        <p className="category-border"></p>
        <AddInvestmentDrawer onSuccess={fetchInvestments} />
      </div>

      <div className="investment-card-main">
        <Flex
          wrap
          gap={16}
          style={{ padding: 24 }}
        >
          {investments.map((investment) => (
            <InvestmentCard
              key={investment.instrumentsId}
              data={investment}
              onEdit={setEditingInvestment}
              onDelete={handleDelete}
            />
          ))}
        </Flex>
      </div>

      <EditInvestmentDrawer
        investment={editingInvestment}
        onClose={() => setEditingInvestment(null)}
        onSuccess={fetchInvestments}
      />
    </div>
  );
};

export default Investment;
