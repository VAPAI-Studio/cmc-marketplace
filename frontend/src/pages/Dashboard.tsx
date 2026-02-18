import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Badge, Tabs, Spinner } from '../components/ui';
import { listingsApi, aiApi, favoritesApi, inquiriesApi, adminApi, type Listing, type Inquiry, type ListingCreatePayload } from '../lib/api';
import { useToastHelpers } from '../components/ui';
import {
  Film,
  Eye,
  Heart,
  Mail,
  Plus,
  Edit,
  TrendingUp,
  Users,
  CreditCard,
  Brain,
  Shield,
  CheckCircle,
  XCircle,
  Star,
  Scroll,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null; // Protected route handles this
  }

  return (
    <div className="container-custom py-12">
      {user.role === 'admin' ? <AdminDashboard /> : user.role === 'creator' ? <CreatorDashboard /> : <BuyerDashboard />}
    </div>
  );
}

// Creator Dashboard
function CreatorDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Listing[]>([]);
  const [receivedInquiries, setReceivedInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      listingsApi.myListings().catch(() => [] as Listing[]),
      inquiriesApi.received().catch(() => [] as Inquiry[]),
    ]).then(([p, i]) => {
      setProjects(p);
      setReceivedInquiries(i);
    }).finally(() => setLoading(false));
  }, []);

  const stats = {
    totalProjects: projects.length,
    published: projects.filter((p) => p.status === 'published').length,
    totalViews: projects.reduce((sum, p) => sum + p.view_count, 0),
    totalSaves: projects.reduce((sum, p) => sum + p.save_count, 0),
    totalInquiries: receivedInquiries.length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Welcome back, {user?.display_name || 'Creator'}!</h1>
          <p className="text-warm-gray-600">Manage your projects and track performance</p>
        </div>
        <Link to="/submit">
          <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
            Submit New Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <StatsCard icon={<Film className="w-6 h-6" />} label="Total Projects" value={stats.totalProjects} color="navy" />
        <StatsCard icon={<TrendingUp className="w-6 h-6" />} label="Published" value={stats.published} color="gold" />
        <StatsCard icon={<Eye className="w-6 h-6" />} label="Total Views" value={stats.totalViews} />
        <StatsCard icon={<Heart className="w-6 h-6" />} label="Total Saves" value={stats.totalSaves} />
        <StatsCard icon={<Mail className="w-6 h-6" />} label="Inquiries" value={stats.totalInquiries} />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <Tabs defaultValue="projects">
          <Tabs.List>
            <Tabs.Trigger value="projects">My Projects ({projects.length})</Tabs.Trigger>
            <Tabs.Trigger value="inquiries">Received Inquiries ({receivedInquiries.length})</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="projects">
            <Card>
              <div className="p-6">
                {projects.length === 0 ? (
                  <div className="text-center py-16">
                    <Film className="w-16 h-16 text-warm-gray-300 mx-auto mb-4" />
                    <p className="text-warm-gray-600 mb-4">You haven't submitted any projects yet.</p>
                    <Link to="/submit">
                      <Button variant="primary">Submit Your First Project</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-warm-gray-200">
                        <tr>
                          <th className="text-left p-3 font-semibold">Title</th>
                          <th className="text-left p-3 font-semibold">Genre</th>
                          <th className="text-left p-3 font-semibold">Status</th>
                          <th className="text-left p-3 font-semibold">AI Analysis</th>
                          <th className="text-left p-3 font-semibold">Views</th>
                          <th className="text-left p-3 font-semibold">Saves</th>
                          <th className="text-left p-3 font-semibold">Inquiries</th>
                          <th className="text-left p-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((project) => (
                          <ListingRow key={project.id} project={project} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="inquiries">
            <Card>
              <div className="p-6">
                {receivedInquiries.length === 0 ? (
                  <div className="text-center py-16">
                    <Mail className="w-16 h-16 text-warm-gray-300 mx-auto mb-4" />
                    <p className="text-warm-gray-600">No inquiries received yet.</p>
                    <p className="text-sm text-warm-gray-400 mt-1">Buyers will contact you here when interested in your IPs.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-warm-gray-200">
                        <tr>
                          <th className="text-left p-3 font-semibold">From</th>
                          <th className="text-left p-3 font-semibold">IP</th>
                          <th className="text-left p-3 font-semibold">Message</th>
                          <th className="text-left p-3 font-semibold">Date</th>
                          <th className="text-left p-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receivedInquiries.map((inq) => (
                          <tr key={inq.id} className="border-b border-warm-gray-100 hover:bg-warm-gray-50">
                            <td className="p-3">
                              <div className="font-semibold text-sm">{inq.buyer_name || 'Anonymous'}</div>
                              <div className="text-xs text-warm-gray-500">{inq.buyer_contact_email}</div>
                              {inq.company_name && <div className="text-xs text-cmc-gold font-medium">{inq.company_name}</div>}
                            </td>
                            <td className="p-3 text-sm font-medium text-cmc-navy">{inq.listing_title || '—'}</td>
                            <td className="p-3 text-sm text-warm-gray-600 max-w-xs">
                              <p className="line-clamp-2">{inq.message}</p>
                            </td>
                            <td className="p-3 text-sm text-warm-gray-500 whitespace-nowrap">
                              {new Date(inq.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <Badge variant={inq.status === 'responded' ? 'navy' : 'warning'} size="sm" className="capitalize">
                                {inq.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </Tabs.Content>
        </Tabs>
      )}
    </div>
  );
}

// Buyer Dashboard
function BuyerDashboard() {
  const { user } = useAuth();
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      favoritesApi.getSavedListings().catch(() => [] as Listing[]),
      inquiriesApi.sent().catch(() => [] as Inquiry[]),
    ]).then(([saved, sent]) => {
      setSavedListings(saved);
      setInquiries(sent);
    }).finally(() => setLoading(false));
  }, []);

  const responded = inquiries.filter((i) => i.status === 'responded').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2">Welcome back, {user?.display_name || 'Buyer'}!</h1>
          <p className="text-warm-gray-600">Browse and manage your saved IPs</p>
        </div>
        <Link to="/library">
          <Button variant="primary" icon={<Eye className="w-5 h-5" />}>Browse Library</Button>
        </Link>
      </div>

      {/* Subscription */}
      <Card className="mb-8 bg-gradient-to-r from-cmc-navy to-cmc-navy-700 text-white">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white mb-1">Current Plan: Free</h3>
            <p className="text-warm-gray-300 text-sm">Upgrade to access more features</p>
          </div>
          <Button variant="gold" size="lg" icon={<CreditCard className="w-5 h-5" />}>
            Upgrade Plan
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <StatsCard icon={<Heart className="w-6 h-6" />} label="Saved IPs" value={savedListings.length} color="gold" />
        <StatsCard icon={<Mail className="w-6 h-6" />} label="Inquiries Sent" value={inquiries.length} />
        <StatsCard icon={<Users className="w-6 h-6" />} label="Responses" value={responded} color="navy" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <Tabs defaultValue="saved">
          <Tabs.List>
            <Tabs.Trigger value="saved">Saved IPs ({savedListings.length})</Tabs.Trigger>
            <Tabs.Trigger value="inquiries">My Inquiries ({inquiries.length})</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="saved">
            <Card>
              <div className="p-6">
                {savedListings.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-16 h-16 text-warm-gray-300 mx-auto mb-4" />
                    <p className="text-warm-gray-600 mb-4">No saved IPs yet.</p>
                    <Link to="/library"><Button variant="primary">Browse Library</Button></Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedListings.map((ip) => (
                      <Card key={ip.id} className="hover:shadow-elevated transition-shadow">
                        <div className="p-4">
                          <h4 className="font-semibold mb-1 truncate">{ip.title}</h4>
                          <p className="text-sm text-warm-gray-500 mb-2 line-clamp-2">{ip.tagline}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="navy" size="sm">{ip.genre}</Badge>
                            <Link to={`/library/${ip.slug}`}>
                              <Button variant="ghost" size="sm">View</Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="inquiries">
            <Card>
              <div className="p-6">
                {inquiries.length === 0 ? (
                  <div className="text-center py-16">
                    <Mail className="w-16 h-16 text-warm-gray-300 mx-auto mb-4" />
                    <p className="text-warm-gray-600 mb-4">No inquiries sent yet.</p>
                    <Link to="/library"><Button variant="primary">Browse Library</Button></Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-warm-gray-200">
                        <tr>
                          <th className="text-left p-3 font-semibold">IP</th>
                          <th className="text-left p-3 font-semibold">Message</th>
                          <th className="text-left p-3 font-semibold">Date</th>
                          <th className="text-left p-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.map((inq) => (
                          <tr key={inq.id} className="border-b border-warm-gray-100 hover:bg-warm-gray-50">
                            <td className="p-3 font-semibold text-cmc-navy">{inq.listing_title || inq.listing_id}</td>
                            <td className="p-3 text-sm text-warm-gray-600 max-w-xs truncate">{inq.message}</td>
                            <td className="p-3 text-sm text-warm-gray-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                            <td className="p-3">
                              <Badge variant={inq.status === 'responded' ? 'navy' : 'default'} size="sm" className="capitalize">
                                {inq.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </Tabs.Content>
        </Tabs>
      )}
    </div>
  );
}

// Stats Card Component
function StatsCard({
  icon,
  label,
  value,
  color = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: 'navy' | 'gold' | 'default';
}) {
  const colorClasses = {
    navy: 'text-cmc-navy bg-cmc-navy-50',
    gold: 'text-cmc-gold bg-cmc-gold-50',
    default: 'text-warm-gray-700 bg-warm-gray-50',
  };

  return (
    <Card>
      <div className="p-4">
        <div className={`inline-flex p-2 rounded-lg mb-2 ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-warm-gray-600">{label}</div>
      </div>
    </Card>
  );
}

// Analysis Modal Component
interface AnalysisData {
  commercial_score?: number;
  commercial_justification?: string;
  executive_summary?: string;
  strengths?: string[];
  improvements?: string[];
  target_audience?: string;
  budget_range?: string;
  comparables?: string[];
  raw_text?: string;
}

function AnalysisModal({ listingId, title, onClose }: { listingId: string; title: string; onClose: () => void }) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiApi.getAnalysis(listingId)
      .then((result) => setAnalysis((result.analysis ?? null) as AnalysisData | null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [listingId]);

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-warm-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-cmc-navy">AI Analysis: {title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : !analysis ? (
            <p className="text-warm-gray-500 text-center py-8">No analysis available yet.</p>
          ) : (
            <div className="space-y-6">
              {/* Score */}
              {analysis.commercial_score != null && (
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-cmc-navy">{String(analysis.commercial_score)}</div>
                  <div>
                    <div className="text-sm font-medium text-warm-gray-500">Commercial Score</div>
                    <div className="text-sm text-warm-gray-600">{String(analysis.commercial_justification ?? '')}</div>
                  </div>
                </div>
              )}

              {/* Executive Summary */}
              {analysis.executive_summary && (
                <div>
                  <h3 className="font-semibold text-cmc-navy mb-2">Executive Summary</h3>
                  <p className="text-warm-gray-700 text-sm whitespace-pre-line">{String(analysis.executive_summary)}</p>
                </div>
              )}

              {/* Strengths */}
              {Array.isArray(analysis.strengths) && analysis.strengths.length > 0 && (
                <div>
                  <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
                  <ul className="space-y-1">
                    {(analysis.strengths as string[]).map((s, i) => (
                      <li key={i} className="text-sm text-warm-gray-700 flex gap-2">
                        <span className="text-green-600">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {Array.isArray(analysis.improvements) && analysis.improvements.length > 0 && (
                <div>
                  <h3 className="font-semibold text-amber-700 mb-2">Areas for Improvement</h3>
                  <ul className="space-y-1">
                    {(analysis.improvements as string[]).map((s, i) => (
                      <li key={i} className="text-sm text-warm-gray-700 flex gap-2">
                        <span className="text-amber-500">→</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Target Audience & Budget */}
              <div className="grid grid-cols-2 gap-4">
                {analysis.target_audience && (
                  <div>
                    <h4 className="text-sm font-medium text-warm-gray-500">Target Audience</h4>
                    <p className="text-sm text-warm-gray-700">{analysis.target_audience}</p>
                  </div>
                )}
                {analysis.budget_range && (
                  <div>
                    <h4 className="text-sm font-medium text-warm-gray-500">Budget Range</h4>
                    <p className="text-sm text-warm-gray-700">{analysis.budget_range}</p>
                  </div>
                )}
              </div>

              {/* Comparables */}
              {Array.isArray(analysis.comparables) && analysis.comparables.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-warm-gray-500">Comparables</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(analysis.comparables as string[]).map((c, i) => (
                      <Badge key={i} variant="default" size="sm">{c}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw text fallback */}
              {analysis.raw_text && analysis.executive_summary === 'Analysis completed. See full text for details.' && (
                <div>
                  <h3 className="font-semibold text-cmc-navy mb-2">Full Analysis</h3>
                  <div className="text-sm text-warm-gray-700 whitespace-pre-line bg-warm-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {String(analysis.raw_text).replace(/```json\n?/g, '').replace(/```\n?/g, '')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Listing Row Component (uses real API data)
function ListingRow({ project }: { project: Listing }) {
  const [aiStatus, setAiStatus] = useState(project.ai_analysis_status);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showOnePager, setShowOnePager] = useState(false);
  const [currentProject, setCurrentProject] = useState(project);

  const statusColors: Record<string, 'navy' | 'gold' | 'warning' | 'default'> = {
    draft: 'default',
    pending: 'warning',
    published: 'navy',
    archived: 'default',
  };

  const aiStatusColors: Record<string, 'navy' | 'warning' | 'danger' | 'default'> = {
    pending: 'default',
    analyzing: 'warning',
    ready: 'navy',
    failed: 'danger',
  };

  async function handleAnalyze() {
    setAnalyzing(true);
    try {
      await aiApi.analyze(project.id);
      setAiStatus('analyzing');
      // Poll until done (max 24 attempts = 2 min)
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        if (attempts > 24) {
          clearInterval(poll);
          setAnalyzing(false);
          return;
        }
        try {
          const result = await aiApi.getAnalysis(project.id);
          if (result.status !== 'analyzing') {
            setAiStatus(result.status);
            setAnalyzing(false);
            clearInterval(poll);
          }
        } catch (err) {
          console.warn('Poll attempt failed, retrying...', err);
          // Don't stop polling on a single failure
          if (attempts > 5) {
            clearInterval(poll);
            setAnalyzing(false);
          }
        }
      }, 5000);
    } catch (err) {
      console.error('Analysis failed:', err);
      setAnalyzing(false);
    }
  }

  return (
    <>
    <tr className="border-b border-warm-gray-100 hover:bg-warm-gray-50 transition">
      <td className="p-3 font-semibold">{currentProject.title}</td>
      <td className="p-3 text-warm-gray-600">{project.genre}</td>
      <td className="p-3">
        <Badge variant={statusColors[project.status] ?? 'default'} size="sm" className="capitalize">
          {project.status}
        </Badge>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <Badge variant={aiStatusColors[aiStatus] ?? 'default'} size="sm" className="capitalize">
            {aiStatus.replace('_', ' ')}
          </Badge>
          {(aiStatus === 'pending' || aiStatus === 'failed') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAnalyze}
              disabled={analyzing}
              title="Analyze with AI"
            >
              <Brain className="w-4 h-4 text-cmc-navy" />
            </Button>
          )}
          {aiStatus === 'ready' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAnalysis(true)}
              title="View Analysis"
            >
              <Eye className="w-4 h-4 text-cmc-gold" />
            </Button>
          )}
          {(aiStatus === 'analyzing' || analyzing) && (
            <Spinner size="sm" />
          )}
        </div>
      </td>
      <td className="p-3 text-warm-gray-600">{project.view_count}</td>
      <td className="p-3 text-warm-gray-600">{project.save_count}</td>
      <td className="p-3">
        {project.inquiry_count > 0 ? (
          <span className="font-semibold text-cmc-gold">{project.inquiry_count}</span>
        ) : (
          <span className="text-warm-gray-400">0</span>
        )}
      </td>
      <td className="p-3">
        <div className="flex gap-2">
          {currentProject.slug && (
            <Link to={`/library/${currentProject.slug}`} title="View public page">
              <Button variant="ghost" size="sm" aria-label="View public page">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={() => setShowEdit(true)} title="Edit" aria-label="Edit IP">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowOnePager(true)} title="Generate One-Pager" aria-label="Generate one-pager">
            <Scroll className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
    {showAnalysis && (
      <AnalysisModal
        listingId={project.id}
        title={currentProject.title}
        onClose={() => setShowAnalysis(false)}
      />
    )}
    {showEdit && (
      <EditIPModal
        listing={currentProject}
        onClose={() => setShowEdit(false)}
        onSaved={(updated) => setCurrentProject(updated)}
      />
    )}
    {showOnePager && (
      <OnePagerModal
        listingId={project.id}
        title={currentProject.title}
        onClose={() => setShowOnePager(false)}
      />
    )}
    </>
  );
}

// Edit IP Modal
function EditIPModal({ listing, onClose, onSaved }: { listing: Listing; onClose: () => void; onSaved: (updated: Listing) => void }) {
  const toast = useToastHelpers();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: listing.title,
    tagline: listing.tagline || '',
    logline: listing.logline || '',
    description: listing.description,
    genre: listing.genre,
    format: listing.format,
    tier: listing.tier,
    period: listing.period || '',
    location: listing.location || '',
    target_audience: listing.target_audience || '',
    rights_holder: listing.rights_holder || '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await listingsApi.update(listing.id, form as Partial<ListingCreatePayload>);
      onSaved(updated);
      toast.success('IP updated successfully!');
      onClose();
    } catch {
      toast.error('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  }

  const genreOptions = ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi', 'Fantasy', 'Thriller', 'Historical'];
  const formatOptions = ['Series', 'Film', 'Limited Series', 'Short'];
  const tierOptions = ['flagship', 'strong', 'hidden-gem'];

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-warm-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 id="edit-modal-title" className="text-xl font-bold text-cmc-navy">Edit: {listing.title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">✕</Button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Title *</label>
              <input className="input" value={form.title} onChange={set('title')} required />
            </div>
            <div>
              <label className="label">Tagline</label>
              <input className="input" value={form.tagline} onChange={set('tagline')} />
            </div>
          </div>
          <div>
            <label className="label">Logline</label>
            <textarea className="input min-h-[80px] resize-none" value={form.logline} onChange={set('logline')} />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea className="input min-h-[120px] resize-none" value={form.description} onChange={set('description')} required />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="label">Genre</label>
              <select className="input" value={form.genre} onChange={set('genre')}>
                {genreOptions.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Format</label>
              <select className="input" value={form.format} onChange={set('format')}>
                {formatOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Tier</label>
              <select className="input" value={form.tier} onChange={set('tier')}>
                {tierOptions.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Period</label>
              <input className="input" value={form.period} onChange={set('period')} placeholder="e.g. Medieval, Modern, Future" />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={form.location} onChange={set('location')} placeholder="e.g. Argentina, Spain, Space" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Target Audience</label>
              <input className="input" value={form.target_audience} onChange={set('target_audience')} />
            </div>
            <div>
              <label className="label">Rights Holder</label>
              <input className="input" value={form.rights_holder} onChange={set('rights_holder')} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <Spinner size="sm" /> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

// One-Pager Modal
function OnePagerModal({ listingId, title, onClose }: { listingId: string; title: string; onClose: () => void }) {
  const toast = useToastHelpers();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Try to load existing one-pager
    setLoading(true);
    aiApi.getOnePager(listingId)
      .then((result) => setContent(result.one_pager))
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [listingId]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const result = await aiApi.generateOnePager(listingId);
      setContent(result.one_pager);
      toast.success('One-pager generated!');
    } catch {
      toast.error('Failed to generate one-pager. Make sure the IP has been analyzed first.');
    } finally {
      setGenerating(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="onepager-modal-title">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-warm-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 id="onepager-modal-title" className="text-xl font-bold text-cmc-navy">One-Pager: {title}</h2>
            <p className="text-sm text-warm-gray-500 mt-1">AI-generated pitch document</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">✕</Button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : content ? (
            <>
              <div className="prose prose-sm max-w-none bg-warm-gray-50 rounded-lg p-6 text-warm-gray-800 whitespace-pre-wrap font-mono text-sm leading-relaxed mb-4 max-h-96 overflow-y-auto">
                {content}
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm" onClick={handleGenerate} disabled={generating}>
                  {generating ? <Spinner size="sm" /> : 'Regenerate'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(content);
                    toast.success('Copied to clipboard!');
                  }}
                >
                  Copy to Clipboard
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Scroll className="w-16 h-16 text-warm-gray-300 mx-auto mb-4" />
              <p className="text-warm-gray-600 mb-2">No one-pager generated yet.</p>
              <p className="text-sm text-warm-gray-400 mb-6">The IP must have a completed AI analysis first.</p>
              <Button variant="primary" onClick={handleGenerate} disabled={generating} icon={<Brain className="w-4 h-4" />}>
                {generating ? <Spinner size="sm" /> : 'Generate One-Pager'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Admin Dashboard
function AdminDashboard() {
  const [stats, setStats] = useState<{ listings: Record<string, number>; total_listings: number; users: Record<string, number>; total_users: number; total_inquiries: number } | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.stats().catch(() => null),
      adminApi.listings().catch(() => [] as Listing[]),
      adminApi.inquiries().catch(() => [] as Inquiry[]),
    ]).then(([s, l, i]) => {
      setStats(s);
      setListings(l);
      setInquiries(i);
    }).finally(() => setLoading(false));
  }, []);

  async function handleApprove(id: string) {
    await adminApi.approve(id);
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: 'published' } : l));
  }

  async function handleReject(id: string) {
    await adminApi.reject(id);
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: 'archived' } : l));
  }

  async function handleFeature(id: string, featured: boolean) {
    await adminApi.feature(id, featured);
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, featured } : l));
  }

  const pending = listings.filter((l) => l.status === 'draft' || l.status === 'pending');
  const published = listings.filter((l) => l.status === 'published');

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-cmc-navy" />
        <div>
          <h1 className="mb-1">Admin Panel</h1>
          <p className="text-warm-gray-600">Moderate content and manage the platform</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={<Film className="w-6 h-6" />} label="Total IPs" value={stats.total_listings} color="navy" />
          <StatsCard icon={<CheckCircle className="w-6 h-6" />} label="Published" value={stats.listings.published || 0} color="gold" />
          <StatsCard icon={<Users className="w-6 h-6" />} label="Total Users" value={stats.total_users} />
          <StatsCard icon={<Mail className="w-6 h-6" />} label="Inquiries" value={stats.total_inquiries} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <Tabs defaultValue="pending">
          <Tabs.List>
            <Tabs.Trigger value="pending">Pending ({pending.length})</Tabs.Trigger>
            <Tabs.Trigger value="published">Published ({published.length})</Tabs.Trigger>
            <Tabs.Trigger value="inquiries">Inquiries ({inquiries.length})</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="pending">
            <Card>
              <div className="p-6">
                {pending.length === 0 ? (
                  <p className="text-center text-warm-gray-500 py-8">No pending IPs.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-warm-gray-200">
                        <tr>
                          <th className="text-left p-3 font-semibold">Title</th>
                          <th className="text-left p-3 font-semibold">Genre</th>
                          <th className="text-left p-3 font-semibold">Tier</th>
                          <th className="text-left p-3 font-semibold">Status</th>
                          <th className="text-left p-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pending.map((l) => (
                          <tr key={l.id} className="border-b border-warm-gray-100 hover:bg-warm-gray-50">
                            <td className="p-3 font-semibold">{l.title}</td>
                            <td className="p-3 text-warm-gray-600">{l.genre}</td>
                            <td className="p-3"><Badge variant="default" size="sm" className="capitalize">{l.tier}</Badge></td>
                            <td className="p-3"><Badge variant="warning" size="sm" className="capitalize">{l.status}</Badge></td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button variant="primary" size="sm" onClick={() => handleApprove(l.id)}>
                                  <CheckCircle className="w-4 h-4" /> Publish
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleReject(l.id)}>
                                  <XCircle className="w-4 h-4" /> Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="published">
            <Card>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-warm-gray-200">
                      <tr>
                        <th className="text-left p-3 font-semibold">Title</th>
                        <th className="text-left p-3 font-semibold">Genre</th>
                        <th className="text-left p-3 font-semibold">Score</th>
                        <th className="text-left p-3 font-semibold">Featured</th>
                        <th className="text-left p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {published.map((l) => (
                        <tr key={l.id} className="border-b border-warm-gray-100 hover:bg-warm-gray-50">
                          <td className="p-3 font-semibold">{l.title}</td>
                          <td className="p-3 text-warm-gray-600">{l.genre}</td>
                          <td className="p-3">
                            {l.ai_score ? (
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="w-3 h-3 fill-cmc-gold text-cmc-gold" />
                                {l.ai_score}
                              </div>
                            ) : '—'}
                          </td>
                          <td className="p-3">
                            <Badge variant={l.featured ? 'gold' : 'default'} size="sm">
                              {l.featured ? 'Featured' : 'Normal'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleFeature(l.id, !l.featured)}>
                                <Star className="w-4 h-4" /> {l.featured ? 'Unfeature' : 'Feature'}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleReject(l.id)}>
                                <XCircle className="w-4 h-4" /> Archive
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="inquiries">
            <Card>
              <div className="p-6">
                {inquiries.length === 0 ? (
                  <p className="text-center text-warm-gray-500 py-8">No inquiries yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-warm-gray-200">
                        <tr>
                          <th className="text-left p-3 font-semibold">From</th>
                          <th className="text-left p-3 font-semibold">Listing</th>
                          <th className="text-left p-3 font-semibold">Message</th>
                          <th className="text-left p-3 font-semibold">Date</th>
                          <th className="text-left p-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.map((inq) => (
                          <tr key={inq.id} className="border-b border-warm-gray-100 hover:bg-warm-gray-50">
                            <td className="p-3">
                              <div className="font-semibold text-sm">{inq.buyer_name || '—'}</div>
                              <div className="text-xs text-warm-gray-500">{inq.buyer_contact_email}</div>
                              {inq.company_name && <div className="text-xs text-warm-gray-500">{inq.company_name}</div>}
                            </td>
                            <td className="p-3 text-sm font-medium text-cmc-navy">{inq.listing_title || inq.listing_id}</td>
                            <td className="p-3 text-sm text-warm-gray-600 max-w-xs truncate">{inq.message}</td>
                            <td className="p-3 text-sm text-warm-gray-500">{new Date(inq.created_at).toLocaleDateString()}</td>
                            <td className="p-3">
                              <Badge variant={inq.status === 'responded' ? 'navy' : 'default'} size="sm" className="capitalize">
                                {inq.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </Tabs.Content>
        </Tabs>
      )}
    </div>
  );
}
