import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Github,
  ExternalLink,
  Sparkles,
  Star,
  CheckCircle2,
  X,
  Eye,
  Layers,
  Code2,
  Wand2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { Project, ProjectCategory } from '../../types/campusly';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const PortfolioPage: React.FC = () => {
  const {
    profile,
    projects,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    removeSkill,
    portfolioCompleteness,
  } = useCampus();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Skill input
  const [newSkillInput, setNewSkillInput] = useState('');

  // Project Form
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ProjectCategory>('Machine Learning');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formTechInput, setFormTechInput] = useState('');
  const [formGithubUrl, setFormGithubUrl] = useState('');
  const [formLiveDemoUrl, setFormLiveDemoUrl] = useState('');
  const [formCompletionDate, setFormCompletionDate] = useState('2026-08');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formError, setFormError] = useState('');

  // Gemini Description Improver state
  const [improvingDesc, setImprovingDesc] = useState(false);
  const [aiImprovedText, setAiImprovedText] = useState('');
  const [showAiDiff, setShowAiDiff] = useState(false);
  const [aiError, setAiError] = useState('');

  const categories: ProjectCategory[] = [
    'Machine Learning',
    'Data Science',
    'Web Development',
    'Mobile & Cloud',
    'Research',
  ];

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const openAddModal = () => {
    setEditingProject(null);
    setFormTitle('');
    setFormCategory('Machine Learning');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormTechInput('Python, Scikit-learn, Pandas');
    setFormGithubUrl('https://github.com/aaravmehta-ds/');
    setFormLiveDemoUrl('');
    setFormCompletionDate('2026-08');
    setFormFeatured(false);
    setFormError('');
    setShowAiDiff(false);
    setAiImprovedText('');
    setModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setFormTitle(p.title);
    setFormCategory(p.category);
    setFormShortDesc(p.shortDescription);
    setFormFullDesc(p.fullDescription);
    setFormTechInput(p.technologies.join(', '));
    setFormGithubUrl(p.githubUrl || '');
    setFormLiveDemoUrl(p.liveDemoUrl || '');
    setFormCompletionDate(p.completionDate);
    setFormFeatured(p.featured);
    setFormError('');
    setShowAiDiff(false);
    setAiImprovedText('');
    setModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim() || !formShortDesc.trim()) {
      setFormError('Please enter a project title and short description.');
      return;
    }

    const techArray = formTechInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectData = {
      title: formTitle.trim(),
      category: formCategory,
      shortDescription: formShortDesc.trim(),
      fullDescription: formFullDesc.trim() || formShortDesc.trim(),
      technologies: techArray.length > 0 ? techArray : ['Python', 'Data Science'],
      githubUrl: formGithubUrl.trim() || undefined,
      liveDemoUrl: formLiveDemoUrl.trim() || undefined,
      completionDate: formCompletionDate,
      featured: formFeatured,
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }

    setModalOpen(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim()) {
      addSkill(newSkillInput.trim());
      setNewSkillInput('');
    }
  };

  // Call server-side Gemini Project Description Improver
  const handleEnhanceWithGemini = async () => {
    if (!formFullDesc && !formShortDesc) {
      setFormError('Please write a draft description first before asking Gemini to improve it.');
      return;
    }
    setImprovingDesc(true);
    setAiError('');

    try {
      const response = await fetch('/api/gemini/improve-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: formTitle,
          currentDescription: formFullDesc || formShortDesc,
          technologies: formTechInput.split(',').map((t) => t.trim()),
        }),
      });

      const data = await response.json();
      if (data.improvedText) {
        setAiImprovedText(data.improvedText);
        setShowAiDiff(true);
      } else {
        setAiError('Could not refine description. Please try again.');
      }
    } catch (err: any) {
      setAiError('Network error connecting to Gemini API.');
    } finally {
      setImprovingDesc(false);
    }
  };

  const applyAiText = () => {
    setFormFullDesc(aiImprovedText);
    setShowAiDiff(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-indigo-600" />
            Student Engineering Portfolio & Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Showcase machine learning models, analytical pipelines, and software engineering artifacts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            Preview Portfolio
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      {/* Portfolio Completeness Bar & Bio Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Student Profile Snapshot & Skills (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={profile.fullName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
            />
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {profile.fullName}
                </h2>
                <Badge variant="primary" size="sm">
                  {profile.degree} (Sem {profile.currentSemester})
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {profile.specialization} • {profile.institutionName}
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 pt-1 leading-relaxed">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Technical Skills Manager */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Technical Stack & Competencies ({profile.skills.length})
              </span>
              <span className="text-[11px] text-slate-400">Click × to remove</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-rose-500 transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill input */}
            <form onSubmit={handleAddSkill} className="flex gap-2 pt-1 max-w-sm">
              <input
                type="text"
                placeholder="Add skill (e.g. PyTorch, Next.js)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 cursor-pointer"
              >
                Add Skill
              </button>
            </form>
          </div>
        </div>

        {/* Portfolio Completeness Metric (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Portfolio Completeness
              </span>
              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                {portfolioCompleteness.score}%
              </span>
            </div>

            <div className="mt-2 w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all"
                style={{ width: `${portfolioCompleteness.score}%` }}
              />
            </div>

            <div className="mt-4 space-y-2">
              {portfolioCompleteness.breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        item.achieved ? 'text-emerald-500' : 'text-slate-300'
                      }`}
                    />
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {item.score}/{item.maxScore}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-tight border-t border-slate-100 dark:border-slate-800 pt-3">
            Recruiter advice: Repositories with live deployment links and concise architectural
            highlights achieve 2.4x higher interview callback rates.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All Categories ({projects.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between relative group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant={p.featured ? 'primary' : 'neutral'} size="sm">
                  {p.category}
                </Badge>
                {p.featured && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    Featured
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {p.title}
              </h3>

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {p.fullDescription}
              </p>

              {/* Technologies */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer: Links & Action buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View GitHub Repository"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {p.liveDemoUrl && (
                  <a
                    href={p.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                    title="Open Live Demo"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <span className="text-[10px] text-slate-400 font-medium">
                  {p.completionDate}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEditModal(p)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Edit project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(p.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  aria-label="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal with Gemini Description Assistant */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'Edit Project Showcase' : 'Add New Portfolio Project'}
        description="Share your data science models, pipelines, and engineering accomplishments with recruiters."
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveProject} className="space-y-4">
          {formError && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Student Academic Risk Classifier"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as ProjectCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Description (1 sentence summary) *
            </label>
            <input
              type="text"
              required
              value={formShortDesc}
              onChange={(e) => setFormShortDesc(e.target.value)}
              placeholder="Predictive modeling pipeline detecting academic risk factors with explainable SHAP."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          {/* Full Description with Gemini Enhance Button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Detailed Technical Description
              </label>
              <button
                type="button"
                onClick={handleEnhanceWithGemini}
                disabled={improvingDesc}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                {improvingDesc ? 'Gemini is refining...' : 'Gemini Description Assistant'}
              </button>
            </div>
            <textarea
              rows={4}
              value={formFullDesc}
              onChange={(e) => setFormFullDesc(e.target.value)}
              placeholder="Detail your problem statement, model architectures evaluated, validation strategy, and verified outcomes..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[11px]"
            />
          </div>

          {/* AI Diff / Approval Box */}
          {showAiDiff && (
            <div className="p-3.5 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-indigo-600" />
                  Gemini Refined Draft (Review & Approve)
                </span>
                <span className="text-[10px] text-slate-500">No fabricated metrics added</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 dark:border-indigo-900 text-slate-800 dark:text-slate-200 font-sans text-xs whitespace-pre-line">
                {aiImprovedText}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAiDiff(false)}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={applyAiText}
                  className="px-3 py-1 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Apply to Project Description
                </button>
              </div>
            </div>
          )}

          {aiError && <p className="text-xs text-rose-500">{aiError}</p>}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Technologies (comma-separated) *
            </label>
            <input
              type="text"
              required
              value={formTechInput}
              onChange={(e) => setFormTechInput(e.target.value)}
              placeholder="Python, PyTorch, Scikit-learn, FastAPI, Docker"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={formGithubUrl}
                onChange={(e) => setFormGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Live Demo / Deployed URL
              </label>
              <input
                type="url"
                value={formLiveDemoUrl}
                onChange={(e) => setFormLiveDemoUrl(e.target.value)}
                placeholder="https://project.pages.dev"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Completion Period (YYYY-MM)
              </label>
              <input
                type="text"
                value={formCompletionDate}
                onChange={(e) => setFormCompletionDate(e.target.value)}
                placeholder="2026-08"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="flex items-center pt-5">
              <input
                id="featured"
                type="checkbox"
                checked={formFeatured}
                onChange={(e) => setFormFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="featured" className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mark as Featured Project
              </label>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Project?"
        description="Are you sure you want to remove this project from your showcase?"
      >
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setDeleteConfirmId(null)}
            className="px-3.5 py-2 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (deleteConfirmId) {
                deleteProject(deleteConfirmId);
                setDeleteConfirmId(null);
              }
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
          >
            Confirm Delete
          </button>
        </div>
      </Modal>

      {/* Public Recruiter Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="Public Recruiter Portfolio Preview"
        maxWidth="3xl"
      >
        <div className="space-y-6 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {profile.fullName} • Data Science Portfolio
              </h2>
              <p className="text-slate-500">
                {profile.degree} (Sem {profile.currentSemester}) • {profile.institutionName}
              </p>
            </div>
            <Badge variant="success" size="md">
              Available for Internships
            </Badge>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Verified Technical Competencies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              Featured Engineering Artifacts
            </h4>
            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{p.title}</span>
                    <Badge variant="neutral" size="sm">
                      {p.category}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs">{p.fullDescription}</p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    {p.githubUrl && <span>GitHub: {p.githubUrl}</span>}
                    {p.liveDemoUrl && <span>Live Demo: {p.liveDemoUrl}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
