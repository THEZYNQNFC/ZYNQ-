import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Upload,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Save,
  Share2,
  ExternalLink,
  Sparkles,
  Smartphone,
  Eye,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Spinner } from '../../components/common/Spinner';
import { LiveProfilePreview } from '../../components/profile/LiveProfilePreview';
import {
  profileService,
  isValidWebUrl,
  RESERVED_USERNAMES,
  sanitizeUsername,
} from '../../services/profileService';
import { Profile } from '../../types/profile';
import { LinkItem, SocialPlatform } from '../../types/link';
import { compressImageFile } from '../../utils/imageCompressor';

const SOCIAL_PLATFORMS: {
  id: SocialPlatform;
  name: string;
  placeholder: string;
  iconText: string;
  defaultPrefix: string;
}[] = [
  { id: 'linkedin', name: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourname', iconText: '💼', defaultPrefix: 'https://linkedin.com/in/' },
  { id: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/yourname', iconText: '📸', defaultPrefix: 'https://instagram.com/' },
  { id: 'x', name: 'X / Twitter', placeholder: 'https://x.com/yourname', iconText: '𝕏', defaultPrefix: 'https://x.com/' },
  { id: 'facebook', name: 'Facebook', placeholder: 'https://facebook.com/yourname', iconText: '👥', defaultPrefix: 'https://facebook.com/' },
  { id: 'youtube', name: 'YouTube', placeholder: 'https://youtube.com/@channel', iconText: '▶️', defaultPrefix: 'https://youtube.com/@' },
  { id: 'tiktok', name: 'TikTok', placeholder: 'https://tiktok.com/@yourname', iconText: '🎵', defaultPrefix: 'https://tiktok.com/@' },
  { id: 'github', name: 'GitHub', placeholder: 'https://github.com/yourname', iconText: '🐙', defaultPrefix: 'https://github.com/' },
  { id: 'telegram', name: 'Telegram', placeholder: 'https://t.me/yourname', iconText: '✈️', defaultPrefix: 'https://t.me/' },
];

export const ProfileEditPage: React.FC = () => {
  const { currentUser, user, updateUserData } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeUser = currentUser || user;
  const userId = activeUser?.userId || 'usr_demo_101';

  // Core profile fields
  const [fullName, setFullName] = useState(activeUser?.name || '');
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<string>('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(activeUser?.email || '');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');

  // Links state
  const [links, setLinks] = useState<LinkItem[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [activeTabMobile, setActiveTabMobile] = useState<'editor' | 'preview'>('editor');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Username validation state
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    valid: boolean | null;
    message: string;
  }>({ checking: false, valid: null, message: '' });

  // Custom link modal state
  const [customLinkModalOpen, setCustomLinkModalOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [customLinkTitle, setCustomLinkTitle] = useState('');
  const [customLinkUrl, setCustomLinkUrl] = useState('');
  const [customLinkDescription, setCustomLinkDescription] = useState('');

  // Image URL input state
  const [showPhotoUrlInput, setShowPhotoUrlInput] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [persistentDataUrl, setPersistentDataUrl] = useState<string>('');

  // Load existing profile from Firestore or local cache
  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const existingProfile = await profileService.getProfileByUserId(userId);
        const existingLinks = await profileService.getProfileLinks(userId);

        if (existingProfile) {
          setFullName(existingProfile.fullName || activeUser?.name || '');
          setUsername(existingProfile.username || '');
          setProfileImage(existingProfile.profileImage || activeUser?.photoURL || '');
          setTitle(existingProfile.title || '');
          setCompany(existingProfile.company || '');
          setBio(existingProfile.bio || '');
          setLocation(existingProfile.location || '');
          setPhone(existingProfile.phone || '');
          setEmail(existingProfile.email || activeUser?.email || '');
          setWhatsapp(existingProfile.whatsapp || '');
          setWebsite(existingProfile.website || '');
        } else {
          // Initialize clean starter state
          const defaultSlug =
            activeUser?.username ||
            activeUser?.name?.toLowerCase().replace(/[^a-z0-9-]/g, '') ||
            activeUser?.email?.split('@')[0].replace(/[^a-z0-9-]/g, '') ||
            'user';
          setUsername(defaultSlug);
          setFullName(activeUser?.name || '');
          setEmail(activeUser?.email || '');
          setProfileImage(activeUser?.photoURL || '');
        }

        // Initialize social links if none exist
        if (existingLinks.length > 0) {
          setLinks(existingLinks);
        } else {
          const starterSocials: LinkItem[] = SOCIAL_PLATFORMS.map((platform, idx) => ({
            id: `social_${platform.id}`,
            userId,
            type: 'social',
            platform: platform.id,
            title: platform.name,
            url: '',
            order: idx,
            enabled: false,
          }));
          setLinks(starterSocials);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  // Username validation debouncing
  useEffect(() => {
    if (!username) {
      setUsernameStatus({ checking: false, valid: null, message: '' });
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameStatus({ checking: true, valid: null, message: 'Checking availability...' });
      const result = await profileService.checkUsernameAvailability(username, userId);
      setUsernameStatus({
        checking: false,
        valid: result.available,
        message: result.available ? 'Username available' : result.reason || 'Username unavailable',
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [username, userId]);

  // Track unsaved changes
  const markDirty = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  // Handle Photo File Upload
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isUploadingPhoto) return; // Prevent concurrent duplicate uploads

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const fileType = (file.type || '').toLowerCase();
    if (!validTypes.includes(fileType) && !fileType.startsWith('image/')) {
      toast.error('Please select a valid image file (JPG, PNG, or WEBP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit. Please choose a smaller image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 1. Immediate temporary preview & capture previous valid image for error rollback
    const previousImage = profileImage;
    const tempPreviewUrl = URL.createObjectURL(file);
    setProfileImage(tempPreviewUrl);
    setIsUploadingPhoto(true);

    try {
      // 2. Upload actual file to Firebase Storage under user-specific path
      const persistentUrl = await profileService.uploadProfileImage(userId, file);

      if (!persistentUrl || persistentUrl.startsWith('blob:')) {
        throw new Error('Upload returned an invalid temporary path.');
      }

      // 3. Save download URL directly to the canonical Firestore profile document
      await profileService.updateProfileImageOnly(userId, persistentUrl);

      // 4. Update state from saved profile
      setProfileImage(persistentUrl);
      setPersistentDataUrl(persistentUrl);
      setSelectedImageFile(null);
      updateUserData({ photoURL: persistentUrl });

      toast.success('Profile photo uploaded and saved successfully.');
    } catch (err: unknown) {
      console.error('Photo upload failed:', err);
      // Revert preview to previous valid image if upload fails
      setProfileImage(previousImage);
      toast.error(err instanceof Error ? err.message : 'Photo upload failed. Please try again.');
    } finally {
      URL.revokeObjectURL(tempPreviewUrl);
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle Photo URL Input (separate from file upload)
  const handleApplyPhotoUrl = async () => {
    const trimmed = photoUrlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      toast.error('Image URL must start with http:// or https://');
      return;
    }

    setProfileImage(trimmed);
    try {
      await profileService.updateProfileImageOnly(userId, trimmed);
      updateUserData({ photoURL: trimmed });
      toast.success('Profile photo URL applied and saved.');
    } catch {
      markDirty();
    }
    setShowPhotoUrlInput(false);
    setPhotoUrlInput('');
  };

  // Remove photo
  const handleRemovePhoto = async () => {
    setSelectedImageFile(null);
    setProfileImage('');
    setPersistentDataUrl('');
    try {
      await profileService.updateProfileImageOnly(userId, '');
      updateUserData({ photoURL: null });
      toast.info('Profile photo removed.');
    } catch {
      markDirty();
    }
  };

  // Social link URL update
  const handleSocialUrlChange = (platformId: SocialPlatform, url: string) => {
    setLinks((prev) => {
      const existing = prev.find((l) => l.type === 'social' && l.platform === platformId);
      if (existing) {
        return prev.map((l) =>
          l.id === existing.id
            ? { ...l, url, enabled: url.trim().length > 0 ? true : l.enabled }
            : l
        );
      } else {
        const newSocial: LinkItem = {
          id: `social_${platformId}`,
          userId,
          type: 'social',
          platform: platformId,
          title: platformId.toUpperCase(),
          url,
          order: prev.length,
          enabled: url.trim().length > 0,
        };
        return [...prev, newSocial];
      }
    });
    markDirty();
  };

  // Social link toggle
  const handleSocialToggle = (platformId: SocialPlatform) => {
    setLinks((prev) =>
      prev.map((l) =>
        l.type === 'social' && l.platform === platformId ? { ...l, enabled: !l.enabled } : l
      )
    );
    markDirty();
  };

  // Open custom link modal
  const handleOpenAddCustomLink = () => {
    setEditingLinkId(null);
    setCustomLinkTitle('');
    setCustomLinkUrl('');
    setCustomLinkDescription('');
    setCustomLinkModalOpen(true);
  };

  const handleOpenEditCustomLink = (link: LinkItem) => {
    setEditingLinkId(link.id);
    setCustomLinkTitle(link.title);
    setCustomLinkUrl(link.url);
    setCustomLinkDescription(link.description || '');
    setCustomLinkModalOpen(true);
  };

  // Save custom link from modal
  const handleSaveCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLinkTitle.trim() || !customLinkUrl.trim()) {
      toast.error('Title and URL are required.');
      return;
    }

    if (!isValidWebUrl(customLinkUrl)) {
      toast.error('Please enter a valid HTTP or HTTPS URL.');
      return;
    }

    if (editingLinkId) {
      setLinks((prev) =>
        prev.map((l) =>
          l.id === editingLinkId
            ? {
                ...l,
                title: customLinkTitle.trim(),
                url: customLinkUrl.trim(),
                description: customLinkDescription.trim() || undefined,
              }
            : l
        )
      );
    } else {
      const newCustom: LinkItem = {
        id: `custom_${Date.now()}`,
        userId,
        type: 'custom',
        title: customLinkTitle.trim(),
        url: customLinkUrl.trim(),
        description: customLinkDescription.trim() || undefined,
        order: links.length,
        enabled: true,
      };
      setLinks((prev) => [...prev, newCustom]);
    }

    setCustomLinkModalOpen(false);
    markDirty();
    toast.success(editingLinkId ? 'Custom link updated.' : 'Custom link added.');
  };

  // Delete custom link
  const handleDeleteCustomLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    markDirty();
    toast.info('Link deleted.');
  };

  // Reorder custom link
  const handleMoveCustomLink = (indexInCustoms: number, direction: 'up' | 'down') => {
    const customLinks = links.filter((l) => l.type === 'custom');
    const socialLinks = links.filter((l) => l.type !== 'custom');

    const targetIndex = direction === 'up' ? indexInCustoms - 1 : indexInCustoms + 1;
    if (targetIndex < 0 || targetIndex >= customLinks.length) return;

    const reordered = [...customLinks];
    const [moved] = reordered.splice(indexInCustoms, 1);
    reordered.splice(targetIndex, 0, moved);

    setLinks([...socialLinks, ...reordered]);
    markDirty();
  };

  // Save full profile
  const handleSaveProfile = async (e?: React.FormEvent): Promise<boolean> => {
    e?.preventDefault();
    if (isSaving) return false;

    // Validations
    if (!fullName.trim()) {
      toast.error('Full Name is required.');
      return false;
    }

    if (!username.trim() || usernameStatus.valid === false) {
      toast.error(usernameStatus.message || 'Please provide a valid, unique username.');
      return false;
    }

    if (website && !isValidWebUrl(website)) {
      toast.error('Website URL must start with http:// or https://');
      return false;
    }

    setIsSaving(true);
    try {
      let finalImageUrl = profileImage || '';
      // Ensure no temporary blob URL is ever persisted to Firestore
      if (finalImageUrl.startsWith('blob:')) {
        finalImageUrl = persistentDataUrl || '';
      }

      const cleanUsername = username.toLowerCase().trim();
      const profileData: Partial<Profile> = {
        userId,
        username: cleanUsername,
        fullName: fullName.trim(),
        profileImage: finalImageUrl,
        title: title.trim(),
        company: company.trim(),
        bio: bio.trim(),
        location: location.trim(),
        phone: phone.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        website: website.trim(),
      };

      console.log('[CustomerHub Save] Writing profile to Firestore path: profiles/' + userId, {
        documentPath: `profiles/${userId}`,
        fields: Object.keys(profileData),
        username: cleanUsername,
        fullName: profileData.fullName,
        hasImage: Boolean(finalImageUrl),
        imageType: finalImageUrl.startsWith('data:') ? 'base64' : (finalImageUrl.startsWith('http') ? 'url' : 'none'),
      });

      const saved = await profileService.saveProfileAndLinks(userId, profileData, links);

      console.log('[CustomerHub Save] Write succeeded for profiles/' + userId, {
        savedUsername: saved.username,
        savedFullName: saved.fullName,
      });

      setFullName(saved.fullName);
      setUsername(saved.username);
      setProfileImage(saved.profileImage || '');
      updateUserData({
        name: saved.fullName,
        username: saved.username,
        photoURL: saved.profileImage || null,
      });

      if (saved.username) {
        localStorage.setItem('tapcard_last_saved_username', saved.username);
        localStorage.setItem('tapcard_last_saved_userid', userId);
      }

      setHasUnsavedChanges(false);
      try {
        window.dispatchEvent(new Event('storage'));
      } catch {}

      toast.success('Profile saved successfully.');
      return true;
    } catch (err: unknown) {
      console.error('[CustomerHub Save] Write failed for profiles/' + userId, err);
      toast.error(err instanceof Error ? err.message : 'Failed to save profile changes.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Preview data object
  const previewProfile: Partial<Profile> = {
    userId,
    username,
    fullName,
    profileImage,
    title,
    company,
    bio,
    location,
    phone,
    email,
    whatsapp,
    website,
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" className="text-slate-800" />
          <p className="text-xs font-medium text-slate-500">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Profile Builder
            </h1>
            {hasUnsavedChanges && (
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Unsaved changes
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure your digital business card identity, contact channels, and portfolio links.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {username && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Eye className="w-4 h-4 text-emerald-600" />}
              onClick={async () => {
                if (hasUnsavedChanges || selectedImageFile) {
                  const savedOk = await handleSaveProfile();
                  if (!savedOk) return;
                }
                const targetSlug = sanitizeUsername(username);
                navigate(`/u/${targetSlug}`);
              }}
            >
              View Public Card
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSaveProfile}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Mobile Tab Toggle (Editor vs Live Preview) */}
      <div className="flex lg:hidden bg-slate-200/70 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTabMobile('editor')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTabMobile === 'editor'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Profile Editor
        </button>
        <button
          type="button"
          onClick={() => setActiveTabMobile('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTabMobile === 'preview'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Live Phone Preview</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Profile Form Editor (hidden on mobile if preview tab active) */}
        <div className={`lg:col-span-7 space-y-6 ${activeTabMobile === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* 1. PERSONAL INFORMATION */}
            <Card padding="md" className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                    Personal Information
                  </h2>
                  <p className="text-xs text-slate-500">Your core professional profile details.</p>
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="relative w-20 h-20 rounded-full border-2 border-slate-200 bg-white overflow-hidden shadow-xs shrink-0 flex items-center justify-center">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-slate-400">
                      {fullName ? fullName.charAt(0).toUpperCase() : 'TC'}
                    </span>
                  )}
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                      <Spinner size="sm" className="text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800">Profile Photo</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Upload a high-resolution headshot (JPG, PNG, or WEBP, up to 5MB).
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      leftIcon={<Upload className="w-3.5 h-3.5 text-slate-600" />}
                    >
                      {isUploadingPhoto ? 'Uploading...' : profileImage ? 'Change Photo' : 'Upload Photo'}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPhotoUrlInput(!showPhotoUrlInput)}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      {showPhotoUrlInput ? 'Hide URL' : 'Link URL'}
                    </Button>

                    {profileImage && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleRemovePhoto}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {showPhotoUrlInput && (
                    <div className="flex items-center gap-2 pt-2">
                      <Input
                        placeholder="https://example.com/avatar.jpg"
                        value={photoUrlInput}
                        onChange={(e) => setPhotoUrlInput(e.target.value)}
                        className="text-xs h-8"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={handleApplyPhotoUrl}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Full Name & Job Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    markDirty();
                  }}
                  required
                />

                <Input
                  label="Job Title"
                  placeholder="e.g. Founder & Managing Director"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    markDirty();
                  }}
                  leftIcon={<Building className="w-4 h-4" />}
                />
              </div>

              {/* Company & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Company or Organization"
                  placeholder="e.g. Aura Venture Labs"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    markDirty();
                  }}
                  leftIcon={<Building className="w-4 h-4" />}
                />

                <Input
                  label="Location"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    markDirty();
                  }}
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              </div>

              {/* Professional Bio with character counter */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Professional Bio
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      bio.length > 450 ? 'text-amber-600 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {bio.length}/500
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    markDirty();
                  }}
                  placeholder="A concise description of your background, achievements, and what you do..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-colors"
                />
              </div>
            </Card>

            {/* 2. USERNAME & PROFILE URL */}
            <Card padding="md" className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                    Username & Public URL
                  </h2>
                  <p className="text-xs text-slate-500">Your custom digital card destination address.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Username *
                </label>
                <div className="flex rounded-xl shadow-xs border border-slate-200 overflow-hidden focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10">
                  <span className="inline-flex items-center px-3.5 bg-slate-50 text-xs font-mono text-slate-500 border-r border-slate-200">
                    tapcard.in/u/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(sanitizeUsername(e.target.value));
                      markDirty();
                    }}
                    placeholder="your-name"
                    className="flex-1 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none"
                    required
                  />
                </div>

                {/* Validation Status Notice */}
                {username && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs">
                    {usernameStatus.checking ? (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Spinner size="sm" /> Checking availability...
                      </span>
                    ) : usernameStatus.valid === true ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {usernameStatus.message}
                      </span>
                    ) : usernameStatus.valid === false ? (
                      <span className="text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {usernameStatus.message}
                      </span>
                    ) : null}
                  </div>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  Lowercase letters, numbers, and hyphens only (3-30 characters).
                </p>
              </div>
            </Card>

            {/* 3. CONTACT INFORMATION */}
            <Card padding="md" className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                    Direct Contact Channels
                  </h2>
                  <p className="text-xs text-slate-500">Only configured channels appear on your card.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Direct Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    markDirty();
                  }}
                  leftIcon={<Phone className="w-4 h-4" />}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="contact@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    markDirty();
                  }}
                  leftIcon={<Mail className="w-4 h-4" />}
                />

                <Input
                  label="WhatsApp Number (with country code)"
                  type="tel"
                  placeholder="+15550000000"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    markDirty();
                  }}
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                  helperText="Format: country code + digits (e.g. +14155552671)"
                />

                <Input
                  label="Website or Portfolio"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    markDirty();
                  }}
                  leftIcon={<Globe className="w-4 h-4" />}
                />
              </div>
            </Card>

            {/* 4. SOCIAL PROFILES */}
            <Card padding="md" className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                    Social Media Profiles
                  </h2>
                  <p className="text-xs text-slate-500">Enable platforms and paste your profile link.</p>
                </div>
              </div>

              <div className="space-y-3">
                {SOCIAL_PLATFORMS.map((platform) => {
                  const currentLink = links.find(
                    (l) => l.type === 'social' && l.platform === platform.id
                  );
                  const isEnabled = Boolean(currentLink?.enabled);
                  const urlValue = currentLink?.url || '';

                  return (
                    <div
                      key={platform.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isEnabled
                          ? 'border-slate-300 bg-white shadow-2xs'
                          : 'border-slate-100 bg-slate-50/60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Platform Badge & Toggle */}
                        <div className="flex items-center justify-between sm:justify-start gap-2.5 min-w-[150px]">
                          <span className="text-lg leading-none">{platform.iconText}</span>
                          <span className="text-xs font-semibold text-slate-800">{platform.name}</span>
                          <label className="relative inline-flex items-center cursor-pointer ml-auto sm:ml-2">
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={() => handleSocialToggle(platform.id)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                          </label>
                        </div>

                        {/* URL Input */}
                        <div className="flex-1">
                          <input
                            type="url"
                            placeholder={platform.placeholder}
                            value={urlValue}
                            onChange={(e) => handleSocialUrlChange(platform.id, e.target.value)}
                            disabled={!isEnabled}
                            className={`w-full rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                              isEnabled
                                ? 'border-slate-200 bg-white text-slate-900 focus:border-slate-900 focus:outline-none'
                                : 'border-slate-200/60 bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* 5. CUSTOM LINKS */}
            <Card padding="md" className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                      Custom Links & Actions
                    </h2>
                    <p className="text-xs text-slate-500">Add booking links, portfolios, products, or files.</p>
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleOpenAddCustomLink}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Link
                </Button>
              </div>

              {links.filter((l) => l.type === 'custom').length === 0 ? (
                <div className="text-center py-6 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                  <p className="text-xs font-medium text-slate-600">No custom links added yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Add links to Cal.com, your company website, or portfolio.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="mt-3"
                    onClick={handleOpenAddCustomLink}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add First Link
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {links
                    .filter((l) => l.type === 'custom')
                    .map((link, idx, allCustoms) => (
                      <div
                        key={link.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between gap-3 group hover:border-slate-300 transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-900 truncate">
                              {link.title}
                            </span>
                            {!link.enabled && (
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                                Hidden
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-emerald-700 truncate mt-0.5">
                            {link.url}
                          </p>
                          {link.description && (
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {link.description}
                            </p>
                          )}
                        </div>

                        {/* Actions: Reorder, Edit, Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveCustomLink(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveCustomLink(idx, 'down')}
                            disabled={idx === allCustoms.length - 1}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCustomLink(link)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomLink(link.id)}
                            className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>

            {/* Bottom Save Action Bar */}
            <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white flex items-center justify-between shadow-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">
                {hasUnsavedChanges ? 'You have unsaved changes.' : 'All changes saved.'}
              </span>
              <Button
                type="submit"
                size="sm"
                isLoading={isSaving}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
                leftIcon={<Save className="w-4 h-4" />}
              >
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Desktop Sticky Live Phone Preview */}
        <div
          className={`lg:col-span-5 lg:sticky lg:top-20 space-y-4 ${
            activeTabMobile === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Real-Time Mobile Card Preview
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Live updates
            </span>
          </div>

          <LiveProfilePreview profile={previewProfile} links={links} />
        </div>
      </div>

      {/* Add / Edit Custom Link Modal */}
      <Modal
        isOpen={customLinkModalOpen}
        onClose={() => setCustomLinkModalOpen(false)}
        title={editingLinkId ? 'Edit Custom Link' : 'Add Custom Link'}
        description="Add an external link, calendar booking, portfolio, or document."
      >
        <form onSubmit={handleSaveCustomLink} className="space-y-4">
          <Input
            label="Button Title *"
            placeholder="e.g. Schedule a 15-min Meeting"
            value={customLinkTitle}
            onChange={(e) => setCustomLinkTitle(e.target.value)}
            required
          />

          <Input
            label="Destination URL *"
            type="url"
            placeholder="https://cal.com/yourname"
            value={customLinkUrl}
            onChange={(e) => setCustomLinkUrl(e.target.value)}
            helperText="Must start with http:// or https://"
            required
          />

          <Input
            label="Subtitle / Description (Optional)"
            placeholder="e.g. Quick intro call via Zoom"
            value={customLinkDescription}
            onChange={(e) => setCustomLinkDescription(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCustomLinkModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingLinkId ? 'Save Link' : 'Add Link'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
