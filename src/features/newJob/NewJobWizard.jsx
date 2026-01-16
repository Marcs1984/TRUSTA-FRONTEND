import React, { useMemo, useState } from "react";

/**
 * NewJobWizard
 * - 5 steps with clickable tabs
 * - Persists form data across steps
 * - Minimal validation per step
 * - Multiupload PDF for plans/docs
 *
 * Props:
 *  - onClose(): close the modal
 *  - onSaved?(payload): called after "Save" (stub)
 */
export default function NewJobWizard({ onClose, onSaved }) {
  const STEPS = useMemo(
    () => [
      { key: "mode", label: "1. Mode" },
      { key: "company", label: "2. Company / Client" },
      { key: "site", label: "3. Site" },
      { key: "docs", label: "4. Plans & Docs" },
      { key: "review", label: "5. Review" },
    ],
    []
  );

  const [stepIdx, setStepIdx] = useState(0);

  const [form, setForm] = useState({
    // step 1
    mode: "Create new job", // or "Accept invite"
    jobId: "",
    title: "",
    status: "Active",
    estimatedValue: "",
    // step 2
    partyType: "Builder / General Contractor", // or "Client / Owner", "Subcontractor"
    orgName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    // step 3
    siteAddress: "",
    lotPlan: "",
    // step 4
    notes: "",
    files: [], // File[]
  });

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const canGoNext = useMemo(() => {
    // very light validation per step
    if (stepIdx === 0) {
      return form.jobId.trim() && form.title.trim();
    }
    if (stepIdx === 1) {
      return form.orgName.trim() && form.contactEmail.trim();
    }
    if (stepIdx === 2) {
      return form.siteAddress.trim();
    }
    return true;
  }, [stepIdx, form]);

  const next = () => setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIdx((i) => Math.max(i - 1, 0));
  const goto = (i) => setStepIdx(i);

  const onPickFiles = (e) => {
    const list = Array.from(e.target.files || []);
    const pdfs = list.filter((f) => f.type === "application/pdf");
    set({ files: [...form.files, ...pdfs] });
    e.target.value = "";
  };

  const removeFile = (name) =>
    set({ files: form.files.filter((f) => f.name !== name) });

  const save = async () => {
    // Minimal stub – wire this to your API when ready.
    const payload = { ...form, files: form.files.map((f) => f.name) };
    onSaved?.(payload);
    onClose?.();
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={(e) => e.stopPropagation()}>
        {/* Tabs */}
        <div style={tabs}>
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => goto(i)}
              style={{
                ...tabBtn,
                ...(i === stepIdx ? tabBtnActive : {}),
              }}
            >
              {s.label}
            </button>
          ))}
          <button onClick={onClose} style={closeX}>
            Close
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 18, paddingTop: 8 }}>
          {stepIdx === 0 && (
            <StepMode form={form} set={set} />
          )}
          {stepIdx === 1 && (
            <StepCompany form={form} set={set} />
          )}
          {stepIdx === 2 && (
            <StepSite form={form} set={set} />
          )}
          {stepIdx === 3 && (
            <StepDocs
              form={form}
              set={set}
              onPickFiles={onPickFiles}
              removeFile={removeFile}
            />
          )}
          {stepIdx === 4 && <StepReview form={form} />}
        </div>

        {/* Footer */}
        <div style={footer}>
          <button onClick={onClose} style={btnGhost}>
            Cancel
          </button>
          {stepIdx > 0 && (
            <button onClick={back} style={btnGhost}>
              Back
            </button>
          )}
          {stepIdx < STEPS.length - 1 ? (
            <button
              onClick={next}
              disabled={!canGoNext}
              style={{ ...btnPrimary, opacity: canGoNext ? 1 : 0.6 }}
            >
              Next
            </button>
          ) : (
            <button onClick={save} style={btnPrimary}>
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------ Steps ------------- */

function Row({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}
const Label = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: "#374151" }}>
    {children}
  </div>
);
const Input = (props) => (
  <input
    {...props}
    style={{
      width: "100%",
      padding: "10px 12px",
      borderRadius: 8,
      border: "1px solid #e5e7eb",
      outline: "none",
    }}
  />
);
const Select = (props) => (
  <select
    {...props}
    style={{
      width: "100%",
      padding: "10px 12px",
      borderRadius: 8,
      border: "1px solid #e5e7eb",
      outline: "none",
      background: "#fff",
    }}
  />
);
const Textarea = (props) => (
  <textarea
    {...props}
    style={{
      width: "100%",
      padding: "10px 12px",
      borderRadius: 8,
      border: "1px solid #e5e7eb",
      outline: "none",
      minHeight: 100,
      resize: "vertical",
    }}
  />
);

function StepMode({ form, set }) {
  return (
    <>
      <Row>
        <div>
          <Label>Mode</Label>
          <Select
            value={form.mode}
            onChange={(e) => set({ mode: e.target.value })}
          >
            <option>Create new job</option>
            <option>Accept invite</option>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={form.status}
            onChange={(e) => set({ status: e.target.value })}
          >
            <option>Active</option>
            <option>Planning</option>
            <option>On Hold</option>
          </Select>
        </div>
      </Row>
      <Row>
        <div>
          <Label>Job ID</Label>
          <Input
            placeholder="e.g. J-1234"
            value={form.jobId}
            onChange={(e) => set({ jobId: e.target.value })}
          />
        </div>
        <div>
          <Label>Title</Label>
          <Input
            placeholder="e.g. High St Apartments"
            value={form.title}
            onChange={(e) => set({ title: e.target.value })}
          />
        </div>
      </Row>
      <Row>
        <div>
          <Label>Estimated Value (AUD)</Label>
          <Input
            placeholder="e.g. 1,250,000"
            value={form.estimatedValue}
            onChange={(e) => set({ estimatedValue: e.target.value })}
          />
        </div>
        <div />
      </Row>
    </>
  );
}

function StepCompany({ form, set }) {
  return (
    <>
      <Row>
        <div>
          <Label>Party Type</Label>
          <Select
            value={form.partyType}
            onChange={(e) => set({ partyType: e.target.value })}
          >
            <option>Builder / General Contractor</option>
            <option>Client / Owner</option>
            <option>Subcontractor</option>
          </Select>
        </div>
        <div>
          <Label>Company / Client Name</Label>
          <Input
            placeholder="Name"
            value={form.orgName}
            onChange={(e) => set({ orgName: e.target.value })}
          />
        </div>
      </Row>
      <Row>
        <div>
          <Label>Primary Contact</Label>
          <Input
            placeholder="Full name"
            value={form.contactName}
            onChange={(e) => set({ contactName: e.target.value })}
          />
        </div>
        <div>
          <Label>Contact Email</Label>
          <Input
            type="email"
            placeholder="name@company.com"
            value={form.contactEmail}
            onChange={(e) => set({ contactEmail: e.target.value })}
          />
        </div>
      </Row>
      <Row>
        <div>
          <Label>Contact Phone</Label>
          <Input
            placeholder="+61 ..."
            value={form.contactPhone}
            onChange={(e) => set({ contactPhone: e.target.value })}
          />
        </div>
        <div />
      </Row>
    </>
  );
}

function StepSite({ form, set }) {
  return (
    <>
      <Row>
        <div>
          <Label>Site Address</Label>
          <Input
            placeholder="Street, Suburb, State, Postcode"
            value={form.siteAddress}
            onChange={(e) => set({ siteAddress: e.target.value })}
          />
        </div>
        <div>
          <Label>Lot / Plan</Label>
          <Input
            placeholder="Lot 12 / DP 345678"
            value={form.lotPlan}
            onChange={(e) => set({ lotPlan: e.target.value })}
          />
        </div>
      </Row>
    </>
  );
}

function StepDocs({ form, set, onPickFiles, removeFile }) {
  return (
    <>
      <Label>Plans / Documents (PDF)</Label>
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={onPickFiles}
      />
      {!!form.files.length && (
        <ul style={{ margin: "10px 0 0 0", paddingLeft: 18 }}>
          {form.files.map((f) => (
            <li key={f.name} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span>{f.name}</span>
              <button onClick={() => removeFile(f.name)} style={chipClose}>
                remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 14 }}>
        <Label>Notes</Label>
        <Textarea
          placeholder="Optional notes…"
          value={form.notes}
          onChange={(e) => set({ notes: e.target.value })}
        />
      </div>
    </>
  );
}

function StepReview({ form }) {
  const Item = ({ k, v }) => (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 8 }}>
      <div style={{ color: "#6b7280" }}>{k}</div>
      <div style={{ fontWeight: 600, color: "#111827" }}>{v || "—"}</div>
    </div>
  );
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <Item k="Mode" v={form.mode} />
      <Item k="Status" v={form.status} />
      <Item k="Job ID" v={form.jobId} />
      <Item k="Title" v={form.title} />
      <Item k="Estimated Value" v={form.estimatedValue} />
      <Item k="Party Type" v={form.partyType} />
      <Item k="Company / Client" v={form.orgName} />
      <Item k="Contact Name" v={form.contactName} />
      <Item k="Contact Email" v={form.contactEmail} />
      <Item k="Contact Phone" v={form.contactPhone} />
      <Item k="Site Address" v={form.siteAddress} />
      <Item k="Lot / Plan" v={form.lotPlan} />
      <Item k="Files" v={form.files.map((f) => f.name).join(", ")} />
      <Item k="Notes" v={form.notes} />
    </div>
  );
}

/* ------------- Styles -------------- */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const sheet = {
  width: "min(1040px, 95vw)",
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 24px 48px rgba(0,0,0,.18)",
  overflow: "hidden",
};

const tabs = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  padding: 12,
  borderBottom: "1px solid #eef2f7",
  background: "#fafafa",
};

const tabBtn = {
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
  color: "#374151",
};

const tabBtnActive = {
  borderColor: "#3b82f6",
  background: "#e0ecff",
  color: "#1d4ed8",
  fontWeight: 700,
};

const closeX = {
  marginLeft: "auto",
  border: "1px solid #e5e7eb",
  background: "#fff",
  borderRadius: 8,
  padding: "6px 10px",
  cursor: "pointer",
};

const footer = {
  display: "flex",
  gap: 10,
  justifyContent: "flex-end",
  alignItems: "center",
  padding: 12,
  borderTop: "1px solid #eef2f7",
};

const btnPrimary = {
  padding: "10px 16px",
  background: "#111827",
  color: "#fff",
  border: 0,
  borderRadius: 10,
  cursor: "pointer",
};

const btnGhost = {
  padding: "10px 16px",
  background: "#f3f4f6",
  color: "#111827",
  border: 0,
  borderRadius: 10,
  cursor: "pointer",
};

const chipClose = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  borderRadius: 8,
  padding: "2px 8px",
  cursor: "pointer",
  fontSize: 12,
};
