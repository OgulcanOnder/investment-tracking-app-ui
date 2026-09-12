import "../style/Debt.css";
import "../style/AddDebtDrawer.css";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Drawer, Flex, Form, Input, InputNumber, Modal, Spin, Typography } from "antd";
import { Debt, DebtType } from "../data/Debt";
import { useEffect, useState } from "react";
import { createDebt, getAllDebt, getTotalDebt, deleteDebt, updateDebt } from "../service/DebtService";
import { debtTypeLabels } from "../data/Debt";
import { DebtTypeIcons } from "../data/DebtIcons";

const { Text } = Typography;

const formatCurrency = (value: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(value);

interface DebtCardProps {
  data: Debt;
  onEdit: (debts: Debt) => void;
  onDelete: (id: number) => void;
}

interface DebtCardIconProps {
  debtType: DebtType;
  className?: string;
}

const DebtCardIcon = ({ debtType, className }: DebtCardIconProps) => {
  const DebtIcon = DebtTypeIcons[debtType];
  return <DebtIcon className={className} />;
};
const DebtCard = ({ data, onEdit, onDelete }: DebtCardProps) => {
  return (
    <Card
      className={"card"}
      styles={{ body: { padding: 16 } }}
    >
      <Flex
        gap={14}
        align="flex-start"
      >
        <div className={"debt-image-placeholder"}>
          <DebtCardIcon
            debtType={data.debtType}
            className={"debtType-icon"}
          />
        </div>

        <Flex
          vertical
          flex={1}
        >
          <Text className={"title"}>{debtTypeLabels[data.debtType]}</Text>

          <div className={"meta-row"}>
            <Text className={"value"}>{data.description}</Text>
          </div>
        </Flex>
      </Flex>

      <Divider style={{ margin: "12px 0" }} />

      <div className={"total-row"}>
        <span className={"total-label"}>TOPLAM BORÇ</span>
        <Text className={"total-value"}>{formatCurrency(data.amount)}</Text>
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
          onClick={() => onDelete(data.id)}
        >
          SİL
        </Button>
      </Flex>
    </Card>
  );
};

export { DebtCard };

interface AddDebtDrawerProps {
  onSuccess: () => void;
}

const AddDebtDrawer = ({ onSuccess }: AddDebtDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<DebtType | null>(null);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  const debtOptions = Object.entries(debtTypeLabels).map(([value, label]) => ({
    value: value as DebtType,
    label,
  }));

  const filtered = debtOptions.filter(({ label }) => label.toLowerCase().includes(search.toLowerCase()));

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setSearch("");
    form.resetFields();
  };

  const handleSubmit = async (values: { description: string; amount: number }) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await createDebt({
        debtType: selected,
        description: values.description,
        amount: values.amount,
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
        Borç Ekle
      </Button>

      <Drawer
        title="Borç Ekle"
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
          <p className="section-label">Borç Türü</p>

          {selected && (
            <div className="selected-badge">
              <DebtCardIcon debtType={selected} />
              <Text style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{debtTypeLabels[selected]}</Text>
            </div>
          )}

          <Input
            className="search-input"
            placeholder="Ara..."
            prefix={<SearchOutlined style={{ color: "var(--ant-color-text-tertiary)" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="debt-list">
            {filtered.map((debts) => (
              <div
                key={debts.value}
                className={`debt-item ${selected === debts.value ? "selected" : ""}`}
                onClick={() => setSelected(debts.value)}
              >
                <DebtCardIcon debtType={debts.value} />
                <Flex
                  vertical
                  gap={2}
                  flex={1}
                >
                  <span className="debt-name">{debts.label}</span>
                </Flex>
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
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label={<span className="section-label">Borç Açıklaması</span>}
            name="description"
            rules={[{ required: true, message: "Lütfen Açıklama Giriniz." }]}
            style={{ marginBottom: 16 }}
          >
            <Input
              className="number-input"
              placeholder="Açıklama Giriniz"
            />
          </Form.Item>

          <Form.Item
            label={<span className="section-label">Borç miktarı (₺)</span>}
            name="amount"
            rules={[
              { required: true, message: "Lütfen borç miktarı giriniz." },
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
              Borç Ekle
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

interface EditDebtDrawerProps {
  debt: Debt | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditDebtDrawer = ({ debt, onClose, onSuccess }: EditDebtDrawerProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<DebtType | null>(null);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    if (!debt) return;
    form.setFieldsValue({
      description: debt.description,
      amount: debt.amount,
    });
    try {
      setSelected(debt.debtType);
    } catch (err) {
      console.error(err);
    }
  }, [debt, form]);

  const handleClose = () => {
    setSelected(null);
    setSearch("");
    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values: { description: string; amount: number }) => {
    if (!debt || !selected) return;
    setSubmitting(true);
    try {
      await updateDebt(debt.id, {
        debtType: debt.debtType,
        description: values.description,
        amount: values.amount,
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
    <Drawer
      title="Borcu Düzenle"
      placement="right"
      width={400}
      open={!!debt}
      onClose={handleClose}
      styles={{
        body: { padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 },
        header: { borderBottom: "1px solid var(--ant-color-border-secondary)" },
      }}
    >
      <div>
        <p className="section-label">Borç Türü</p>

        {selected && (
          <div className="selected-badge">
            <DebtCardIcon debtType={selected} />
            <Text style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{debtTypeLabels[selected]}</Text>
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
          label={<span className="section-label">Borç Açıklaması</span>}
          name="description"
          rules={[{ required: true, message: "Lütfen Açıklama Giriniz." }]}
          style={{ marginBottom: 16 }}
        >
          <Input
            className="number-input"
            placeholder="Açıklama Giriniz"
          />
        </Form.Item>

        <Form.Item
          label={<span className="section-label">Borç Miktarı (₺)</span>}
          name="amount"
          rules={[
            { required: true, message: "Lütfen borç miktarı giriniz." },
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
    </Drawer>
  );
};

const DebtPage = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [totalDebts, setTotalDebts] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  const fetchDebt = async () => {
    try {
      const results = await getAllDebt();
      setDebts(results);
      const totalResults = await getTotalDebt();
      setTotalDebts(totalResults);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebt();
  }, []);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Borcu sil",
      icon: <ExclamationCircleOutlined />,
      content: "Bu borcu silmek istediğinizden emin misiniz?",
      okText: "Sil",
      okType: "danger",
      cancelText: "Vazgeç",
      onOk: async () => {
        try {
          await deleteDebt(id);
          fetchDebt();
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
    <div className="debt-main">
      <div className="total-main">
        <h3>TOPLAM BORÇLAR</h3>
        <p>{formatCurrency(totalDebts)}</p>
      </div>

      <div className="debt-title">
        <h4>BORÇ DAĞILIMI</h4>
        <p className="category-border"></p>
        {<AddDebtDrawer onSuccess={fetchDebt} />}
      </div>

      <div className="debt-card-main">
        <Flex
          wrap
          gap={16}
          style={{ padding: 24 }}
        >
          {debts.map((debt) => (
            <DebtCard
              key={debt.id}
              data={debt}
              onEdit={setEditingDebt}
              onDelete={handleDelete}
            />
          ))}
        </Flex>
      </div>

      <EditDebtDrawer
        debt={editingDebt}
        onClose={() => setEditingDebt(null)}
        onSuccess={fetchDebt}
      />
    </div>
  );
};

export default DebtPage;
