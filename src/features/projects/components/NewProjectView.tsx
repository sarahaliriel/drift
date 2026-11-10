"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Github, Upload, ArrowLeft, X } from "lucide-react";
import { useDashboard, DashboardPageHeader as PageHeader } from "@/features/dashboard/public";
import { Button } from "@/components/ui/Button";
import { WaveText } from "@/components/ui/WaveText";
import type { SourceType } from "@/features/projects/public";
const repositories = [
  { label: "drift/website", branches: ["main", "develop"] },
  { label: "drift/dashboard-ui", branches: ["main", "preview"] },
  { label: "drift/component-library", branches: ["main"] },
];
const allowed = /\.(css|scss|json|jsx|tsx|js|ts|zip)$/i;
export function NewProjectView() {
  const router = useRouter();
  const { createProject } = useDashboard();
  const input = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<SourceType | null>(null);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [repo, setRepo] = useState(repositories[0].label);
  const [branch, setBranch] = useState("main");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = Array.from(incoming);
    const invalid = next.filter((file) => !allowed.test(file.name));
    setError(
      invalid.length
        ? `Unsupported file${invalid.length > 1 ? "s" : ""}: ${invalid.map((file) => file.name).join(", ")}`
        : "",
    );
    setFiles((current) => [
      ...current,
      ...next.filter(
        (file) =>
          allowed.test(file.name) &&
          !current.some((existing) => existing.name === file.name && existing.size === file.size),
      ),
    ]);
  };
  const selectSource = (value: SourceType) => {
    setSource(value);
    setStep(2);
    setError("");
    setName(value === "github" ? repo.split("/")[1] : "");
  };
  const review = () => {
    if (!name.trim()) return setError("Enter a project name.");
    if (source === "upload" && !files.length)
      return setError("Choose at least one supported file.");
    setError("");
    setStep(3);
  };
  const create = async () => {
    if (!source || saving) return;
    setSaving(true);
    try {
      const project = await createProject({
        name: name.trim(),
        sourceType: source,
        sourceMetadata:
          source === "github"
            ? { label: repo, branch }
            : {
                label: `${files.length} selected file${files.length === 1 ? "" : "s"}`,
                files: files.map((file) => ({ name: file.name, size: file.size })),
              },
      });
      router.push(`/dashboard/projects/${project.id}`);
    } catch {
      setError("Could not save this demo project locally. Try again.");
      setSaving(false);
    }
  };
  return (
    <>
      <PageHeader
        title='Create a project'
        description="Choose how you'd like Drift to analyze your design system."
      />
      <div className='dash-flow'>
        <div className='dash-steps'>
          <span className={step === 1 ? "current" : ""}>1 · Source</span>
          <span className={step === 2 ? "current" : ""}>2 · Configure</span>
          <span className={step === 3 ? "current" : ""}>3 · Review</span>
        </div>
        {step > 1 && (
          <button
            className='dash-back'
            onClick={() => {
              setStep(step - 1);
              setError("");
            }}
          >
            <ArrowLeft size={16} /> <WaveText>Back</WaveText>
          </button>
        )}
        {step === 1 && (
          <div className='dash-source-grid'>
            <button className='dash-source-card' onClick={() => selectSource("github")}>
              <Github size={25} />
              <strong>
                <WaveText>Connect GitHub</WaveText>
              </strong>
              <span>Import a repository and analyze its design system.</span>
              <em>
                <WaveText>Explore demo repositories</WaveText> →
              </em>
            </button>
            <button className='dash-source-card' onClick={() => selectSource("upload")}>
              <Upload size={25} />
              <strong>
                <WaveText>Upload files</WaveText>
              </strong>
              <span>Analyze local project files without connecting a repository.</span>
              <em>
                <WaveText>Choose files</WaveText> →
              </em>
            </button>
          </div>
        )}
        {step === 2 && (
          <div className='dash-form-panel'>
            <span className='dash-demo-note'>
              {source === "github"
                ? "Demo only · No GitHub account is connected."
                : "Files stay in this browser session. Drift stores filenames and sizes only."}
            </span>
            <label className='dash-field'>
              Project name
              <input
                value={name}
                maxLength={80}
                onChange={(e) => setName(e.target.value)}
                placeholder='My project'
              />
            </label>
            {source === "github" ? (
              <>
                <label className='dash-field'>
                  Demo repository
                  <select
                    value={repo}
                    onChange={(e) => {
                      const chosen = repositories.find((r) => r.label === e.target.value)!;
                      setRepo(chosen.label);
                      setBranch(chosen.branches[0]);
                      setName(chosen.label.split("/")[1]);
                    }}
                  >
                    {repositories.map((r) => (
                      <option key={r.label}>{r.label}</option>
                    ))}
                  </select>
                </label>
                <label className='dash-field'>
                  Demo branch
                  <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                    {repositories
                      .find((r) => r.label === repo)
                      ?.branches.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                  </select>
                </label>
              </>
            ) : (
              <>
                <input
                  ref={input}
                  className='sr-only'
                  type='file'
                  multiple
                  accept='.css,.scss,.json,.jsx,.tsx,.js,.ts,.zip'
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                <button
                  className='dash-file-picker'
                  onClick={() => input.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    addFiles(e.dataTransfer.files);
                  }}
                >
                  <Upload size={19} /> <WaveText>Choose files or drop them here</WaveText>{" "}
                  <small>CSS, SCSS, JSON, JSX, TSX, JS, TS, ZIP</small>
                </button>
                {files.map((file, index) => (
                  <div className='dash-file' key={`${file.name}-${index}`}>
                    <span>
                      {file.name} <small>· {(file.size / 1024).toFixed(1)} KB</small>
                    </span>
                    <button
                      onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </>
            )}
            {error && (
              <p className='dash-error' role='alert'>
                {error}
              </p>
            )}
            <Button onClick={review} size='sm' className='rounded-xl px-5 active:translate-y-px'>
              Review project
            </Button>
          </div>
        )}
        {step === 3 && (
          <div className='dash-form-panel'>
            <span className='dash-demo-note'>Local demo project · No scan will run.</span>
            <h2>{name}</h2>
            <dl className='dash-definition'>
              <div>
                <dt>Source</dt>
                <dd>{source === "github" ? "Demo GitHub repository" : "Local file selection"}</dd>
              </div>
              <div>
                <dt>{source === "github" ? "Repository" : "Files"}</dt>
                <dd>{source === "github" ? repo : `${files.length} selected`}</dd>
              </div>
              {source === "github" && (
                <div>
                  <dt>Branch</dt>
                  <dd>{branch}</dd>
                </div>
              )}
            </dl>
            {error && (
              <p className='dash-error' role='alert'>
                {error}
              </p>
            )}
            <Button
              onClick={create}
              disabled={saving}
              size='sm'
              className='rounded-xl px-5 active:translate-y-px'
            >
              {saving ? "Creating…" : "Create demo project"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
