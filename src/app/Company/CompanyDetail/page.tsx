'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { saveProfile as apiSaveProfile, getProfile as apiGetProfile, uploadCompanyImage } from '@/services/CompanyService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { resolveImageUrl } from '@/utils/urlHelper';

interface TeamMember {
  id: number;
  name: string;
  qualification: string;
  role: string;
  photo?: string;
  photoFile?: File;
  photoPreview?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  beforeImage?: string;
  afterImage?: string;
  beforeImageFile?: File;
  afterImageFile?: File;
  beforeImagePreview?: string;
  afterImagePreview?: string;
}

interface ValidationErrors {
  companyName?: string;
  categories?: string;
  services?: string;
  consultationFee?: string;
  establishedYear?: string;
  companySize?: string;
  location?: string;
  email?: string;
  phone?: string;
  overview?: string;
  projectsCompleted?: string;
  happyCustomers?: string;
  awardsWon?: string;
  awardsRecognition?: string;
  teamMembers?: { [key: number]: { name?: string; qualification?: string; role?: string } };
  projects?: { [key: number]: { title?: string; description?: string } };
  logo?: string;
  banner1?: string;
  banner2?: string;
  profilePicture?: string;
}

interface FileUploadState {
  logo?: File;
  banner1?: File;
  banner2?: File;
  profilePicture?: File;
  logoPreview?: string;
  banner1Preview?: string;
  banner2Preview?: string;
  profilePicturePreview?: string;
}

interface CropState {
  isOpen: boolean;
  type: keyof FileUploadState | 'teamMember' | 'projectBefore' | 'projectAfter';
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  aspectRatio?: number;
  teamMemberId?: number;
  projectId?: number;
}

// Real-time validation functions
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

const validateNumber = (value: string, min: number = 0) => {
  const num = parseInt(value);
  return !isNaN(num) && num >= min;
};

const validateYear = (year: string) => {
  const num = parseInt(year);
  const currentYear = new Date().getFullYear();
  return !isNaN(num) && num >= 1900 && num <= currentYear;
};

export default function CompanyProfileManagement() {
  const router = useRouter();
  
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [consultationFee, setConsultationFee] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [companySize, setCompanySize] = useState('1-10 employees');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [overview, setOverview] = useState('');
  const [projectsCompleted, setProjectsCompleted] = useState('');
  const [happyCustomers, setHappyCustomers] = useState('');
  const [awardsWon, setAwardsWon] = useState('');
  const [awardsRecognition, setAwardsRecognition] = useState('');
  const [chatSupport, setChatSupport] = useState(true);
  const [videoCalls, setVideoCalls] = useState(false);
  
  // Dynamic content state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: '', qualification: '', role: '' }
  ]);
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, title: '', description: '', beforeImage: '', afterImage: '' }
  ]);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [fileUploadState, setFileUploadState] = useState<FileUploadState>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<{ [key: string]: boolean }>({});
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Cropper state
  const [cropState, setCropState] = useState<CropState>({
    isOpen: false,
    type: 'logo',
    imageSrc: '',
    onCropComplete: () => {},
  });
  const cropperRef = useRef<ReactCropperElement>(null);

  // Category options
  const categoryOptions = ['Residential', 'Commercial', 'Villas'];
  const serviceOptions = ['Architecture', 'Renovation', 'Interior Design'];
  const companySizeOptions = ['1-10 employees', '11-50 employees', '51-200 employees', '200+ employees'];

  // Handle category selection with validation
  const toggleCategory = (category: string) => {
    const newCategories = categories.includes(category) 
      ? categories.filter(c => c !== category)
      : [...categories, category];
    
    setCategories(newCategories);
    
    // Clear validation error if categories are selected
    if (newCategories.length > 0) {
      setValidationErrors(prev => ({ ...prev, categories: undefined }));
    }
  };

  // Handle service selection with validation
  const toggleService = (service: string) => {
    const newServices = services.includes(service) 
      ? services.filter(s => s !== service)
      : [...services, service];
    
    setServices(newServices);
    
    // Clear validation error if services are selected
    if (newServices.length > 0) {
      setValidationErrors(prev => ({ ...prev, services: undefined }));
    }
  };

  // Team member functions with validation
  const addTeamMember = () => {
    const newId = teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1;
    setTeamMembers([...teamMembers, { id: newId, name: '', qualification: '', role: '' }]);
  };

  const removeTeamMember = (id: number) => {
    if (teamMembers.length > 1) {
      if (window.confirm('Are you sure you want to remove this team member?')) {
        const newTeamMembers = teamMembers.filter(member => member.id !== id);
        setTeamMembers(newTeamMembers);
        
        // Remove validation errors for this team member
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          if (newErrors.teamMembers) {
            delete newErrors.teamMembers[id];
          }
          return newErrors;
        });
      }
    } else {
      toast.error('At least one team member is required.');
    }
  };

  const updateTeamMember = (id: number, field: keyof TeamMember, value: string) => {
    const newTeamMembers = teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    );
    setTeamMembers(newTeamMembers);
    
    // Clear validation error for this field
    if (value.trim()) {
      setValidationErrors(prev => ({
        ...prev,
        teamMembers: {
          ...prev.teamMembers,
          [id]: {
            ...prev.teamMembers?.[id],
            [field]: undefined
          }
        }
      }));
    }
  };

  // Project functions with validation
  const addProject = () => {
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    setProjects([...projects, { id: newId, title: '', description: '', beforeImage: '', afterImage: '' }]);
  };

  const removeProject = (id: number) => {
    if (projects.length > 1) {
      if (window.confirm('Are you sure you want to remove this project?')) {
        const newProjects = projects.filter(project => project.id !== id);
        setProjects(newProjects);
        
        // Remove validation errors for this project
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          if (newErrors.projects) {
            delete newErrors.projects[id];
          }
          return newErrors;
        });
      }
    } else {
      toast.error('At least one project is required.');
    }
  };

  const updateProject = (id: number, field: keyof Project, value: string) => {
    const newProjects = projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    );
    setProjects(newProjects);
    
    // Clear validation error for this field
    if (value.trim()) {
      setValidationErrors(prev => ({
        ...prev,
        projects: {
          ...prev.projects,
          [id]: {
            ...prev.projects?.[id],
            [field]: undefined
          }
        }
      }));
    }
  };

  // Open cropper for image editing
  const openCropper = (
    imageSrc: string, 
    type: CropState['type'], 
    onCropComplete: (croppedFile: File) => void,
    aspectRatio?: number,
    teamMemberId?: number,
    projectId?: number
  ) => {
    setCropState({
      isOpen: true,
      type,
      imageSrc,
      onCropComplete,
      aspectRatio,
      teamMemberId,
      projectId,
    });
  };

  // Handle crop completion
  const handleCropComplete = () => {
    if (typeof cropperRef.current?.cropper !== 'undefined') {
      const cropper = cropperRef.current.cropper;
      
      try {
        const canvas = cropper.getCroppedCanvas({
          maxWidth: 4096,
          maxHeight: 4096,
          fillColor: '#fff',
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
        });
        
        if (!canvas) {
          console.error('Failed to get cropped canvas');
          toast.error('Failed to crop image. Please try again.');
          return;
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'cropped-image.jpg', { 
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            cropState.onCropComplete(file);
            setCropState(prev => ({ ...prev, isOpen: false }));
            toast.success('Image cropped successfully!');
          } else {
            console.error('Failed to create blob from canvas');
            toast.error('Failed to process cropped image. Please try again.');
          }
        }, 'image/jpeg', 0.95);
      } catch (error) {
        console.error('Error during crop:', error);
        toast.error('An error occurred while cropping. Please try again.');
      }
    } else {
      console.error('Cropper instance not found');
      toast.error('Cropper not initialized. Please try uploading the image again.');
    }
  };

  // Enhanced file upload handler with crop option
  const handleFileUpload = async (type: keyof FileUploadState, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      setValidationErrors(prev => ({ 
        ...prev, 
        [type]: 'Please upload a valid image file (JPEG, PNG, GIF, WebP)' 
      }));
      return;
    }

    // Validate file size (max 5MB for cropping)
    if (file.size > 5 * 1024 * 1024) {
      setValidationErrors(prev => ({ 
        ...prev, 
        [type]: 'File size must be less than 5MB' 
      }));
      return;
    }

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Set aspect ratio based on type
      let aspectRatio: number | undefined;
      switch (type) {
        case 'logo':
          aspectRatio = 1; // Square for logo
          break;
        case 'profilePicture':
          aspectRatio = 1; // Square for profile
          break;
        case 'banner1':
        case 'banner2':
          aspectRatio = 1920 / 600; // Banner aspect ratio
          break;
      }

      // Open cropper
      openCropper(
        previewUrl,
        type,
        (croppedFile) => {
          const croppedPreviewUrl = URL.createObjectURL(croppedFile);
          
          // Update file upload state
          setFileUploadState(prev => ({
            ...prev,
            [`${type}Preview`]: croppedPreviewUrl,
            [type]: croppedFile
          }));

          // Show upload success
          setUploadSuccess(prev => ({ ...prev, [type]: true }));
          
          // Clear validation error
          setValidationErrors(prev => ({ ...prev, [type]: undefined }));

          // Auto-hide success message after 3 seconds
          setTimeout(() => {
            setUploadSuccess(prev => ({ ...prev, [type]: false }));
          }, 3000);
        },
        aspectRatio
      );

    } catch (err) {
      console.error("File upload failed:", err);
      setValidationErrors(prev => ({ 
        ...prev, 
        [type]: 'Failed to upload file. Please try again.' 
      }));
    }
  };

  // Handle team member photo upload with cropping
  const handleTeamMemberPhotoUpload = (memberId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    
    openCropper(
      previewUrl,
      'teamMember',
      (croppedFile) => {
        const croppedPreviewUrl = URL.createObjectURL(croppedFile);
        
        setTeamMembers(prev => prev.map(member => 
          member.id === memberId 
            ? { ...member, photoPreview: croppedPreviewUrl, photoFile: croppedFile }
            : member
        ));
      },
      1, // Square aspect ratio for team member photos
      memberId
    );
  };

  // Handle project image upload with cropping
  const handleProjectImageUpload = (projectId: number, type: 'beforeImage' | 'afterImage', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const cropperType = type === 'beforeImage' ? 'projectBefore' : 'projectAfter';
    
    openCropper(
      previewUrl,
      cropperType,
      (croppedFile) => {
        const croppedPreviewUrl = URL.createObjectURL(croppedFile);
        
        setProjects(prev => prev.map(project => 
          project.id === projectId 
            ? { 
                ...project, 
                [`${type}Preview`]: croppedPreviewUrl, 
                [`${type}File`]: croppedFile 
              }
            : project
        ));
      },
      16/9, // Common aspect ratio for project images
      undefined,
      projectId
    );
  };

  // Image removal functions
  const removeBrandImage = (type: keyof FileUploadState) => {
    if (window.confirm(`Are you sure you want to remove the ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}?`)) {
      setFileUploadState(prev => {
        const newState = { ...prev };
        delete newState[type as keyof FileUploadState];
        delete newState[`${type}Preview` as keyof FileUploadState];
        return newState;
      });
      setUploadSuccess(prev => ({ ...prev, [type]: false }));
      toast.info('Image removed successfully');
    }
  };

  const removeTeamMemberPhoto = (memberId: number) => {
    if (window.confirm('Remove this photo?')) {
      setTeamMembers(prev => prev.map(member => 
        member.id === memberId 
          ? { ...member, photoPreview: undefined, photoFile: undefined, photo: undefined }
          : member
      ));
      toast.info('Team member photo removed');
    }
  };

  const removeProjectImage = (projectId: number, type: 'beforeImage' | 'afterImage') => {
    if (window.confirm(`Remove this ${type === 'beforeImage' ? 'Before' : 'After'} image?`)) {
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              [`${type}Preview`]: undefined, 
              [`${type}File`]: undefined,
              [type]: undefined
            }
          : project
      ));
      toast.info('Project image removed');
    }
  };

  // Real-time validation on field change
  const handleFieldChange = (field: keyof ValidationErrors, value: string, validationFn?: (val: string) => boolean) => {
    let error = '';
    
    if (!value.trim()) {
      error = 'This field is required';
    } else if (validationFn && !validationFn(value)) {
      switch (field) {
        case 'email':
          error = 'Please enter a valid email address';
          break;
        case 'phone':
          error = 'Please enter a valid phone number';
          break;
        case 'consultationFee':
          error = 'Please enter a valid fee amount';
          break;
        case 'establishedYear':
          error = 'Please enter a valid year between 1900 and current year';
          break;
        case 'projectsCompleted':
        case 'happyCustomers':
        case 'awardsWon':
          error = 'Please enter a valid number';
          break;
        default:
          error = 'Invalid value';
      }
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }));
  };

  // Validate entire form
  const validateForm = useCallback(() => {
    const errors: ValidationErrors = {};
    
    // Basic info validation
    if (!companyName.trim()) errors.companyName = 'Company name is required';
    if (categories.length === 0) errors.categories = 'Select at least one category';
    if (services.length === 0) errors.services = 'Select at least one service';
    if (!consultationFee.trim()) errors.consultationFee = 'Consultation fee is required';
    else if (!validateNumber(consultationFee, 0)) errors.consultationFee = 'Enter a valid fee amount';
    
    if (!establishedYear.trim()) errors.establishedYear = 'Established year is required';
    else if (!validateYear(establishedYear)) errors.establishedYear = 'Enter a valid year (1900-current)';
    
    if (!companySize.trim()) errors.companySize = 'Company size is required';
    if (!location.trim()) errors.location = 'Location is required';
    
    if (!email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(email)) errors.email = 'Enter a valid email address';
    
    if (!phone.trim()) errors.phone = 'Phone number is required';
    else if (!validatePhone(phone)) errors.phone = 'Enter a valid phone number';
    
    if (!overview.trim()) errors.overview = 'Company overview is required';
    else if (overview.trim().length < 50) errors.overview = 'Overview should be at least 50 characters';
    
    // Statistics validation
    if (!projectsCompleted.trim()) errors.projectsCompleted = 'Projects completed is required';
    else if (!validateNumber(projectsCompleted, 0)) errors.projectsCompleted = 'Enter a valid number';
    
    if (!happyCustomers.trim()) errors.happyCustomers = 'Happy customers count is required';
    else if (!validateNumber(happyCustomers, 0)) errors.happyCustomers = 'Enter a valid number';
    
    if (!awardsWon.trim()) errors.awardsWon = 'Awards won is required';
    else if (!validateNumber(awardsWon, 0)) errors.awardsWon = 'Enter a valid number';
    
    if (!awardsRecognition.trim()) errors.awardsRecognition = 'Awards recognition is required';
    else if (awardsRecognition.trim().length < 20) errors.awardsRecognition = 'Please provide meaningful details';
    
    // Team members validation
    const teamMemberErrors: { [key: number]: { name?: string; qualification?: string; role?: string } } = {};
    teamMembers.forEach(member => {
      const memberErrors: { name?: string; qualification?: string; role?: string } = {};
      if (!member.name.trim()) memberErrors.name = 'Name is required';
      if (!member.qualification.trim()) memberErrors.qualification = 'Qualification is required';
      if (!member.role.trim()) memberErrors.role = 'Role is required';
      
      if (Object.keys(memberErrors).length > 0) {
        teamMemberErrors[member.id] = memberErrors;
      }
    });
    if (Object.keys(teamMemberErrors).length > 0) {
      errors.teamMembers = teamMemberErrors;
    }
    
    // Projects validation
    const projectErrors: { [key: number]: { title?: string; description?: string } } = {};
    projects.forEach(project => {
      const projErrors: { title?: string; description?: string } = {};
      if (!project.title.trim()) projErrors.title = 'Project title is required';
      if (!project.description.trim()) projErrors.description = 'Project description is required';
      else if (project.description.trim().length < 30) projErrors.description = 'Description should be at least 30 characters';
      
      if (Object.keys(projErrors).length > 0) {
        projectErrors[project.id] = projErrors;
      }
    });
    if (Object.keys(projectErrors).length > 0) {
      errors.projects = projectErrors;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [
    companyName, categories, services, consultationFee, establishedYear, 
    companySize, location, email, phone, overview, projectsCompleted, 
    happyCustomers, awardsWon, awardsRecognition, teamMembers, projects
  ]);

  // Check form validity on every state change
  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [validateForm]);

  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const applyProfileData = (company: { 
      name?: string; 
      email?: string; 
      phone?: string; 
      location?: string; 
      profile?: {
        categories?: string[];
        services?: string[];
        consultationFee?: number;
        establishedYear?: number;
        companySize?: string;
        location?: string;
        overview?: string;
        projectsCompleted?: number;
        happyCustomers?: number;
        awardsWon?: number;
        awardsRecognition?: string;
        contactOptions?: {
          chatSupport?: boolean;
          videoCalls?: boolean;
        };
        teamMembers?: TeamMember[];
        projects?: Project[];
        brandIdentity?: {
          logo?: string;
          banner1?: string;
          banner2?: string;
          profilePicture?: string;
        };
      } 
    }) => {
      if (company && company.profile) {
        const p = company.profile;
        setCompanyName(company.name || '');
        setCategories(p.categories || []);
        setServices(p.services || []);
        setConsultationFee(String(p.consultationFee || ''));
        setEstablishedYear(String(p.establishedYear || ''));
        setCompanySize(p.companySize || '1-10 employees');
        setLocation(company.location || p.location || '');
        setEmail(company.email || '');
        setPhone(company.phone || '');
        setOverview(p.overview || '');
        setProjectsCompleted(String(p.projectsCompleted || ''));
        setHappyCustomers(String(p.happyCustomers || ''));
        setAwardsWon(String(p.awardsWon || ''));
        setAwardsRecognition(p.awardsRecognition || '');
        setChatSupport(p.contactOptions?.chatSupport ?? true);
        setVideoCalls(p.contactOptions?.videoCalls ?? false);
        if (p.teamMembers && p.teamMembers.length > 0) setTeamMembers(p.teamMembers);
        if (p.projects && p.projects.length > 0) setProjects(p.projects);
        
        // Load brand identity images
        if (p.brandIdentity) {
          setFileUploadState(prev => ({
            ...prev,
            logoPreview: p.brandIdentity?.logo || '',
            banner1Preview: p.brandIdentity?.banner1 || '',
            banner2Preview: p.brandIdentity?.banner2 || '',
            profilePicturePreview: p.brandIdentity?.profilePicture || '',
          }));
        }
      } else {
        // Handle case where profile object might be missing but we have basic info
        if (company.name) setCompanyName(company.name);
        if (company.email) setEmail(company.email);
        if (company.phone) setPhone(company.phone);
        if (company.location) setLocation(company.location);
      }
    };

    const fetchProfileData = async (id: string) => {
      try {
        const company = await apiGetProfile(id);
        if (company) {
          applyProfileData(company);
          localStorage.setItem("companyProfile", JSON.stringify(company));
        }
      } catch (err: unknown) {
        const error = err as Error;
        toast.error(error.message || 'Failed to fetch profile');
      }
    };

    const storedUser = localStorage.getItem("user");
    const storedProfile = localStorage.getItem("companyProfile");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.id) {
          setCompanyId(user.id);
          
          if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            applyProfileData(profile);
            
            // Ensure basic info is synced from user if profile is missing it
            setCompanyName(prev => prev || user.name || '');
            setEmail(prev => prev || user.email || '');
            setPhone(prev => prev || user.phone || '');
          } else {
            fetchProfileData(user.id);
          }
        }
      } catch (err) {
        console.error("Error parsing stored data", err);
      }
    }
  }, []);

  // Main action functions
  // Main action functions
  const previewProfile = () => {
    if (!isFormValid) {
      toast.error('Please fill all required fields before previewing');
      return;
    }
    setShowPreview(true);
  };

  const saveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!isFormValid) {
      toast.error('Please fill all required fields correctly');
      validateForm(); // Trigger validation to show all errors
      return;
    }
    
    if (!companyId) {
      toast.error('User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      toast.info('Saving profile...');

      // 1. Upload Brand Identity Images
      let logoUrl = fileUploadState.logoPreview || '';
      if (fileUploadState.logo) {
        logoUrl = await uploadCompanyImage(fileUploadState.logo);
      }

      let banner1Url = fileUploadState.banner1Preview || '';
      if (fileUploadState.banner1) {
        banner1Url = await uploadCompanyImage(fileUploadState.banner1);
      }

      let banner2Url = fileUploadState.banner2Preview || '';
      if (fileUploadState.banner2) {
        banner2Url = await uploadCompanyImage(fileUploadState.banner2);
      }

      let profilePictureUrl = fileUploadState.profilePicturePreview || '';
      if (fileUploadState.profilePicture) {
        profilePictureUrl = await uploadCompanyImage(fileUploadState.profilePicture);
      }

      // 2. Upload Team Member Photos
      const updatedTeamMembers = await Promise.all(teamMembers.map(async (member) => {
        let photoUrl = member.photoPreview || '';
        if (member.photoFile) {
          photoUrl = await uploadCompanyImage(member.photoFile);
        }
        // Return clean member object
        return {
          id: member.id,
          name: member.name,
          qualification: member.qualification,
          role: member.role,
          photo: photoUrl
        };
      }));

      // 3. Upload Project Images
      const updatedProjects = await Promise.all(projects.map(async (project) => {
        let beforeUrl = project.beforeImagePreview || '';
        if (project.beforeImageFile) {
          beforeUrl = await uploadCompanyImage(project.beforeImageFile);
        }

        let afterUrl = project.afterImagePreview || '';
        if (project.afterImageFile) {
          afterUrl = await uploadCompanyImage(project.afterImageFile);
        }

        // Return clean project object
        return {
          id: project.id,
          title: project.title,
          description: project.description,
          beforeImage: beforeUrl,
          afterImage: afterUrl
        };
      }));

      const profileData = {
        companyName,
        categories,
        services,
        consultationFee: Number(consultationFee),
        establishedYear: Number(establishedYear),
        companySize,
        location,
        overview,
        projectsCompleted: Number(projectsCompleted),
        happyCustomers: Number(happyCustomers),
        awardsWon: Number(awardsWon),
        awardsRecognition,
        contactOptions: { chatSupport, videoCalls },
        teamMembers: updatedTeamMembers,
        projects: updatedProjects,
        brandIdentity: {
          logo: logoUrl, 
          banner1: banner1Url,
          banner2: banner2Url,
          profilePicture: profilePictureUrl,
        }
      };

      const result = await apiSaveProfile(companyId, profileData);
      toast.success('Profile saved successfully!');
      
      const updatedCompany = result.company;
      if (updatedCompany && updatedCompany.profile) {
        const p = updatedCompany.profile;
        
        // Update file upload previews with the new signed URLs from backend
        setFileUploadState(prev => ({
          ...prev,
          logo: undefined,
          banner1: undefined,
          banner2: undefined,
          profilePicture: undefined,
          logoPreview: p.brandIdentity?.logo || '',
          banner1Preview: p.brandIdentity?.banner1 || '',
          banner2Preview: p.brandIdentity?.banner2 || '',
          profilePicturePreview: p.brandIdentity?.profilePicture || '',
        }));

        if (p.teamMembers) {
          setTeamMembers(p.teamMembers.map((m: TeamMember) => ({
            ...m,
            photoPreview: m.photo
          })));
        }

        if (p.projects) {
          setProjects(p.projects.map((proj: Project) => ({
            ...proj,
            beforeImagePreview: proj.beforeImage,
            afterImagePreview: proj.afterImage
          })));
        }
      }

      // Update local storage
      const storageProfile = {
        ...JSON.parse(localStorage.getItem("companyProfile") || '{}'),
        ...profileData,
        name: companyName,
        email,
        phone,
        location
      };
      localStorage.setItem("companyProfile", JSON.stringify(storageProfile));
    
      
      // Redirect to CompanyDashboard
      setTimeout(() => {
        router.push('/Company/CompanyDashBoard');
      }, 1500);
      
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Save profile error:', err);
      toast.error(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Validation message component
  const ValidationMessage = ({ message, type = 'error' }: { message?: string, type?: 'error' | 'success' }) => {
    if (!message) return null;
    
    return (
      <div className={`mt-2 text-sm flex items-start gap-1.5 ${type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
        <i className={`fas ${type === 'error' ? 'fa-exclamation-circle mt-0.5' : 'fa-check-circle mt-0.5'} text-sm`}></i>
        <span>{message}</span>
      </div>
    );
  };

  // Field validation status indicator
  const FieldValidationStatus = ({ isValid }: { isValid: boolean, fieldName: string }) => {
    if (!isValid) return null;
    
    return (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
        <i className="fas fa-check-circle"></i>
      </div>
    );
  };

  // Section Header Component
  const SectionHeader = ({ icon, title, subtitle }: { icon: string, title: string, subtitle?: string }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <i className={`fas ${icon} text-white text-lg`}></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-gray-600 ml-13">{subtitle}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Image Cropper Modal */}
      {cropState.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <i className="fas fa-crop-alt text-white text-sm"></i>
                </div>
                Crop Image
              </h2>
              <button 
                onClick={() => setCropState(prev => ({ ...prev, isOpen: false }))}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <i className="fas fa-times text-xl text-gray-500"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <div className="bg-white rounded-xl shadow-inner p-4 h-[400px] md:h-[500px] flex items-center justify-center">
                <Cropper
                  src={cropState.imageSrc}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    maxHeight: '600px'
                  }}
                  initialAspectRatio={cropState.aspectRatio}
                  aspectRatio={cropState.aspectRatio}
                  guides={true}
                  ref={cropperRef}
                  viewMode={1}
                  minCropBoxHeight={100}
                  minCropBoxWidth={100}
                  background={true}
                  responsive={true}
                  autoCropArea={0.9}
                  checkOrientation={false}
                  zoomable={true}
                  scalable={true}
                  cropBoxMovable={true}
                  cropBoxResizable={true}
                />
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="fas fa-info-circle text-blue-500"></i>
                    Crop Instructions
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <i className="fas fa-hand-pointer text-gray-400"></i>
                      <span>Drag corners to adjust crop area</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-arrows-alt text-gray-400"></i>
                      <span>Drag inside to reposition</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="fas fa-search-plus text-gray-400"></i>
                      <span>Use scroll wheel to zoom</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <i className="fas fa-ruler-combined text-blue-600"></i>
                    Recommended Dimensions
                  </h3>
                  <p className="text-sm text-blue-700">
                    {cropState.type === 'logo' && 'Square (1:1 ratio) 500×500px'}
                    {cropState.type === 'profilePicture' && 'Square (1:1 ratio) 400×400px'}
                    {cropState.type === 'banner1' && 'Wide (16:5 ratio) 1920×600px'}
                    {cropState.type === 'banner2' && 'Wide (16:5 ratio) 1920×600px'}
                    {cropState.type === 'teamMember' && 'Square (1:1 ratio) 300×300px'}
                    {(cropState.type === 'projectBefore' || cropState.type === 'projectAfter') && 'Wide (16:9 ratio) 1200×675px'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-5 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <button 
                  onClick={() => setCropState(prev => ({ ...prev, isOpen: false }))}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
                
                <div className="flex gap-3">
                  <button 
                    onClick={handleCropComplete}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-crop-alt"></i>
                    Apply Crop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Company Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Management</span>
              </h1>
              <p className="text-gray-600 max-w-3xl">
                Complete your company profile to showcase your expertise, team, and projects to potential clients.
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className={`px-4 py-2 rounded-lg ${isFormValid ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center gap-2">
                  <i className={`fas ${isFormValid ? 'fa-check-circle text-green-500' : 'fa-exclamation-triangle text-yellow-500'}`}></i>
                  <span className={`font-medium ${isFormValid ? 'text-green-800' : 'text-yellow-800'}`}>
                    {isFormValid ? 'Ready to Save' : 'Incomplete'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm font-bold text-blue-600">{isFormValid ? '100%' : '...'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: isFormValid ? '100%' : '60%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {isFormValid 
                ? 'All required fields are completed. You can preview and save your profile.'
                : 'Fill in all required fields marked with * to complete your profile.'}
            </p>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-8">
          {/* Brand Identity Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <SectionHeader 
              icon="fa-palette"
              title="Brand Identity"
              subtitle="Upload your company logo, banners, and profile picture"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Logo Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-base font-semibold text-gray-800">
                    Company Logo <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Required</span>
                </div>
                
                <div className="relative group">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors duration-300 cursor-pointer h-64 flex flex-col items-center justify-center">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload('logo', e)}
                    />
                    <div className="space-y-4 flex flex-col items-center">
                      {fileUploadState.logoPreview ? (
                        <div className="relative">
                          <Image 
                            src={fileUploadState.logoPreview} 
                            alt="Logo preview" 
                            width={160} 
                            height={160} 
                            className="h-40 w-40 rounded-xl object-cover shadow-lg border-4 border-white"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBrandImage('logo');
                            }}
                            className="absolute -top-2 -right-2 bg-white border border-gray-300 text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 shadow-lg"
                            title="Remove logo"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="h-32 w-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <div className="text-center">
                              <i className="fas fa-camera text-3xl text-blue-400 mb-3"></i>
                              <p className="text-sm text-gray-600 font-medium">Upload Logo</p>
                              <p className="text-xs text-gray-500 mt-1">Click to upload & crop</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {uploadSuccess.logo && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <i className="fas fa-check-circle"></i>
                    <span className="text-sm">Logo uploaded successfully</span>
                  </div>
                )}
                <ValidationMessage message={validationErrors.logo} />
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <i className="fas fa-info-circle mt-0.5"></i>
                  <span>Recommended: Square 1:1 ratio, PNG or JPG, max 5MB</span>
                </div>
              </div>

              {/* Banner Upload 1 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-base font-semibold text-gray-800">
                    Banner Image 1 <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Required</span>
                </div>
                
                <div className="relative group">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors duration-300 cursor-pointer h-64 flex flex-col items-center justify-center">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload('banner1', e)}
                    />
                    <div className="space-y-4 flex flex-col items-center w-full">
                      {fileUploadState.banner1Preview ? (
                        <div className="relative w-full">
                          <Image 
                            src={resolveImageUrl(fileUploadState.banner1Preview) || ""} 
                            alt="Banner 1 preview" 
                            width={800} 
                            height={160} 
                            className="w-full h-40 rounded-lg object-cover shadow-md"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBrandImage('banner1');
                            }}
                            className="absolute -top-2 -right-2 bg-white border border-gray-300 text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 shadow-lg"
                            title="Remove image"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="h-40 w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <i className="fas fa-image text-3xl text-blue-400 mb-3"></i>
                            <p className="text-sm text-gray-600 font-medium">Upload Banner</p>
                            <p className="text-xs text-gray-500">Click to upload & crop</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {uploadSuccess.banner1 && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <i className="fas fa-check-circle"></i>
                    <span className="text-sm">Banner 1 uploaded successfully</span>
                  </div>
                )}
                <ValidationMessage message={validationErrors.banner1} />
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <i className="fas fa-info-circle mt-0.5"></i>
                  <span>Recommended: 1920×600 (16:5 ratio), JPG, max 5MB</span>
                </div>
              </div>
            </div>

            {/* Optional Images */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Banner Upload 2 */}
              <div className="space-y-4">
                <label className="block text-base font-semibold text-gray-800">
                  Banner Image 2 <span className="text-gray-500 text-sm ml-2">(Optional)</span>
                </label>
                
                <div className="relative group">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors duration-300 cursor-pointer h-64 flex flex-col items-center justify-center">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload('banner2', e)}
                    />
                    <div className="space-y-4 flex flex-col items-center w-full">
                      {fileUploadState.banner2Preview ? (
                        <div className="relative w-full">
                          <Image 
                            src={resolveImageUrl(fileUploadState.banner2Preview) || ""} 
                            alt="Banner 2 preview" 
                            width={800} 
                            height={160} 
                            className="w-full h-40 rounded-lg object-cover shadow-md"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBrandImage('banner2');
                            }}
                            className="absolute -top-2 -right-2 bg-white border border-gray-300 text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 shadow-lg"
                            title="Remove image"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="h-40 w-full bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <i className="fas fa-image text-3xl text-gray-400 mb-3"></i>
                            <p className="text-sm text-gray-600 font-medium">Upload Banner</p>
                            <p className="text-xs text-gray-500">Optional - Click to upload</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {uploadSuccess.banner2 && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <i className="fas fa-check-circle"></i>
                    <span className="text-sm">Banner 2 uploaded successfully</span>
                  </div>
                )}
                <ValidationMessage message={validationErrors.banner2} />
              </div>

              {/* Profile Picture */}
              <div className="space-y-4">
                <label className="block text-base font-semibold text-gray-800">
                  Profile Picture <span className="text-gray-500 text-sm ml-2">(Optional)</span>
                </label>
                
                <div className="relative group">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors duration-300 cursor-pointer h-64 flex flex-col items-center justify-center">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload('profilePicture', e)}
                    />
                    <div className="space-y-4 flex flex-col items-center">
                      {fileUploadState.profilePicturePreview ? (
                        <div className="relative">
                          <Image 
                            src={fileUploadState.profilePicturePreview} 
                            alt="Profile picture preview" 
                            width={160} 
                            height={160} 
                            className="h-40 w-40 rounded-xl object-cover shadow-lg border-4 border-white"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBrandImage('profilePicture');
                            }}
                            className="absolute -top-2 -right-2 bg-white border border-gray-300 text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 shadow-lg"
                            title="Remove image"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="h-40 w-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <i className="fas fa-user-circle text-3xl text-gray-400 mb-3"></i>
                            <p className="text-sm text-gray-600 font-medium">Profile Picture</p>
                            <p className="text-xs text-gray-500">Optional - Click to upload</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {uploadSuccess.profilePicture && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <i className="fas fa-check-circle"></i>
                    <span className="text-sm">Profile picture uploaded successfully</span>
                  </div>
                )}
                <ValidationMessage message={validationErrors.profilePicture} />
              </div>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <SectionHeader 
              icon="fa-building"
              title="Basic Information"
              subtitle="Tell us about your company"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Company Name */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      handleFieldChange('companyName', e.target.value);
                    }}
                    className={`w-full px-4 py-3 border ${validationErrors.companyName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900`}
                    placeholder="Enter company name"
                  />
                  <FieldValidationStatus isValid={!validationErrors.companyName && companyName.length > 0} fieldName="companyName" />
                </div>
                <ValidationMessage message={validationErrors.companyName} />
              </div>

              {/* Categories */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Categories <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-sm font-normal ml-2">(Select multiple)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categoryOptions.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${categories.includes(category) 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700'}`}
                    >
                      <span className="font-medium">{category}</span>
                      {categories.includes(category) && (
                        <i className="fas fa-check text-blue-500"></i>
                      )}
                    </button>
                  ))}
                </div>
                <ValidationMessage message={validationErrors.categories} />
              </div>

              {/* Services Offered */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Services Offered <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-sm font-normal ml-2">(Select multiple)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {serviceOptions.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${services.includes(service) 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400 bg-white text-gray-700'}`}
                    >
                      <span className="font-medium">{service}</span>
                      {services.includes(service) && (
                        <i className="fas fa-check text-blue-500"></i>
                      )}
                    </button>
                  ))}
                </div>
                <ValidationMessage message={validationErrors.services} />
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Consultation Fee <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="relative">
                    <input 
                      type="number" 
                      value={consultationFee}
                      onChange={(e) => {
                        setConsultationFee(e.target.value);
                        handleFieldChange('consultationFee', e.target.value, (val) => validateNumber(val, 0));
                      }}
                      className={`w-full px-4 py-3 border ${validationErrors.consultationFee ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900`}
                      placeholder="Enter amount"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">USD</span>
                    </div>
                  </div>
                  <FieldValidationStatus isValid={!validationErrors.consultationFee && consultationFee.length > 0} fieldName="consultationFee" />
                </div>
                <ValidationMessage message={validationErrors.consultationFee} />
              </div>

              {/* Established Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Established Year <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="1900" 
                    max="2024"
                    value={establishedYear}
                    onChange={(e) => {
                      setEstablishedYear(e.target.value);
                      handleFieldChange('establishedYear', e.target.value, validateYear);
                    }}
                    className={`w-full px-4 py-3 border ${validationErrors.establishedYear ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900`}
                    placeholder="2020"
                  />
                  <FieldValidationStatus isValid={!validationErrors.establishedYear && establishedYear.length > 0} fieldName="establishedYear" />
                </div>
                <ValidationMessage message={validationErrors.establishedYear} />
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Company Size <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={companySize}
                    onChange={(e) => {
                      setCompanySize(e.target.value);
                      handleFieldChange('companySize', e.target.value);
                    }}
                    className={`w-full px-4 py-3 border ${validationErrors.companySize ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900`}
                  >
                    {companySizeOptions.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <FieldValidationStatus isValid={!validationErrors.companySize && companySize.length > 0} fieldName="companySize" />
                </div>
                <ValidationMessage message={validationErrors.companySize} />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      handleFieldChange('location', e.target.value);
                    }}
                    className={`w-full px-4 py-3 border ${validationErrors.location ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900`}
                    placeholder="City, Country"
                  />
                  <FieldValidationStatus isValid={!validationErrors.location && location.length > 0} fieldName="location" />
                </div>
                <ValidationMessage message={validationErrors.location} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="email"
                    value={email}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed focus:ring-0 focus:border-gray-300"
                    placeholder="company@example.com"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      handleFieldChange('phone', e.target.value, validatePhone);
                    }}
                    className={`w-full px-4 py-3 border ${validationErrors.phone ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900`}
                    placeholder="+1 (555) 123-4567"
                  />
                  <FieldValidationStatus isValid={!validationErrors.phone && phone.length > 0} fieldName="phone" />
                </div>
                <ValidationMessage message={validationErrors.phone} />
              </div>
            </div>
          </div>

          {/* Company Overview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <SectionHeader 
              icon="fa-file-alt"
              title="Company Overview"
              subtitle="Tell your company's story"
            />
            <div className="relative">
              <textarea 
                rows={6}
                value={overview}
                onChange={(e) => {
                  setOverview(e.target.value);
                  handleFieldChange('overview', e.target.value);
                }}
                className={`w-full px-4 py-3 border ${validationErrors.overview ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900`}
                placeholder="Tell us about your company's mission, values, and what makes you unique in the construction and design industry..."
              />
              <div className="flex justify-between items-center mt-2">
                <ValidationMessage message={validationErrors.overview} />
                <div className="text-sm text-gray-500">
                  <span className={overview.length < 50 ? 'text-red-500' : 'text-green-500'}>
                    {overview.length}
                  </span>
                  /50 minimum characters
                </div>
              </div>
            </div>
          </div>

          {/* Contact Options */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <SectionHeader 
              icon="fa-comments"
              title="Contact Options"
              subtitle="Choose how clients can contact you"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <i className="fas fa-comments text-blue-600"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Chat Support</h3>
                      <p className="text-sm text-gray-600">Enable instant messaging</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setChatSupport(!chatSupport)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${chatSupport ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${chatSupport ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <i className="fas fa-video text-purple-600"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Video Calls</h3>
                      <p className="text-sm text-gray-600">Admin verification required</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setVideoCalls(!videoCalls)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${videoCalls ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${videoCalls ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-headset text-4xl text-blue-500 mb-4"></i>
                  <h4 className="font-bold text-gray-900 mb-2">24/7 Support Available</h4>
                  <p className="text-sm text-gray-600">Clients can reach you through enabled contact methods</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <SectionHeader 
              icon="fa-chart-bar"
              title="Company Statistics"
              subtitle="Showcase your achievements"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Projects Completed <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0"
                    value={projectsCompleted}
                    onChange={(e) => {
                      setProjectsCompleted(e.target.value);
                      handleFieldChange('projectsCompleted', e.target.value, (val) => validateNumber(val, 0));
                    }}
                    className={`w-full px-4 py-3 border ${validationErrors.projectsCompleted ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900`}
                    placeholder="50"
                  />
                  <FieldValidationStatus isValid={!validationErrors.projectsCompleted && projectsCompleted.length > 0} fieldName="projectsCompleted" />
                </div>
                <ValidationMessage message={validationErrors.projectsCompleted} />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Happy Customers <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0"
                    value={happyCustomers}
                    onChange={(e) => {
                      setHappyCustomers(e.target.value);
                      handleFieldChange('happyCustomers', e.target.value, (val) => validateNumber(val, 0));
                    }}
                    className={`w-full px-4 py-3 border ${validationErrors.happyCustomers ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900`}
                    placeholder="200"
                  />
                  <FieldValidationStatus isValid={!validationErrors.happyCustomers && happyCustomers.length > 0} fieldName="happyCustomers" />
                </div>
                <ValidationMessage message={validationErrors.happyCustomers} />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Awards Won <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="0"
                    value={awardsWon}
                    onChange={(e) => {
                      setAwardsWon(e.target.value);
                      handleFieldChange('awardsWon', e.target.value, (val) => validateNumber(val, 0));
                    }}
                    className={`w-full px-4 py-3 border ${validationErrors.awardsWon ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900`}
                    placeholder="5"
                  />
                  <FieldValidationStatus isValid={!validationErrors.awardsWon && awardsWon.length > 0} fieldName="awardsWon" />
                </div>
                <ValidationMessage message={validationErrors.awardsWon} />
              </div>
              
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 h-full flex items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <i className="fas fa-trophy text-blue-600"></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Industry Recognition</p>
                      <p className="text-xs text-gray-600">Based on your achievements</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <i className="fas fa-users text-white text-lg"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
                  <p className="text-gray-600">Showcase your expert team</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={addTeamMember}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-md transition-all duration-200 font-medium"
              >
                <i className="fas fa-plus"></i>
                Add Member
              </button>
            </div>
            
            <div className="space-y-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Photo Upload */}
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-800">
                        Profile Photo
                        <span className="text-gray-500 text-xs font-normal ml-2">(Optional)</span>
                      </label>
                      <div className="relative group">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition-colors duration-300 cursor-pointer h-48 flex flex-col items-center justify-center">
                          <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            accept="image/*"
                            onChange={(e) => handleTeamMemberPhotoUpload(member.id, e)}
                          />
                          {member.photoPreview ? (
                            <div className="relative w-full h-full">
                              <Image 
                                src={member.photoPreview} 
                                alt={`${member.name} preview`} 
                                width={300} 
                                height={200}
                                className="w-full h-full rounded-lg object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeTeamMemberPhoto(member.id);
                                }}
                                className="absolute -top-2 -right-2 bg-white border border-gray-300 text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 shadow-lg"
                                title="Remove photo"
                              >
                                <i className="fas fa-trash text-sm"></i>
                              </button>
                            </div>
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex flex-col items-center justify-center">
                              <i className="fas fa-user-plus text-3xl text-gray-400 mb-2"></i>
                              <p className="text-sm text-gray-600">Upload Photo</p>
                              <p className="text-xs text-gray-500">Click to crop</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Member Details */}
                    <div className="space-y-4 lg:col-span-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            value={member.name}
                            onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                            className={`w-full px-3 py-2 border ${validationErrors.teamMembers?.[member.id]?.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
                            placeholder="Full Name"
                          />
                          <ValidationMessage message={validationErrors.teamMembers?.[member.id]?.name} />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Qualification <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            value={member.qualification}
                            onChange={(e) => updateTeamMember(member.id, 'qualification', e.target.value)}
                            className={`w-full px-3 py-2 border ${validationErrors.teamMembers?.[member.id]?.qualification ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
                            placeholder="B.Arch, M.Eng, etc."
                          />
                          <ValidationMessage message={validationErrors.teamMembers?.[member.id]?.qualification} />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Role <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            value={member.role}
                            onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                            className={`w-full px-3 py-2 border ${validationErrors.teamMembers?.[member.id]?.role ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
                            placeholder="Senior Architect"
                          />
                          <ValidationMessage message={validationErrors.teamMembers?.[member.id]?.role} />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeTeamMember(member.id)}
                          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          <i className="fas fa-trash"></i>
                          Remove Member
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <i className="fas fa-trophy text-white text-lg"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Projects & Success Stories</h2>
                  <p className="text-gray-600">Showcase your best work</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={addProject}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-md transition-all duration-200 font-medium"
              >
                <i className="fas fa-plus"></i>
                Add Project
              </button>
            </div>
            
            <div className="space-y-8">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Project Details */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Project Title <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          className={`w-full px-4 py-3 border ${validationErrors.projects?.[project.id]?.title ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
                          placeholder="Modern Villa Construction"
                        />
                        <ValidationMessage message={validationErrors.projects?.[project.id]?.title} />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Project Description <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                          rows={4}
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          className={`w-full px-4 py-3 border ${validationErrors.projects?.[project.id]?.description ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
                          placeholder="Describe the project details, challenges overcome, and outcomes achieved..."
                        />
                        <div className="flex justify-between items-center mt-2">
                          <ValidationMessage message={validationErrors.projects?.[project.id]?.description} />
                          <div className="text-sm text-gray-500">
                            <span className={project.description.length < 30 ? 'text-red-500' : 'text-green-500'}>
                              {project.description.length}
                            </span>
                            /30 minimum characters
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Project Images */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Before Image
                          <span className="text-gray-500 text-xs font-normal ml-2">(Optional)</span>
                        </label>
                        <div className="relative group">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors duration-300 cursor-pointer h-40 flex flex-col items-center justify-center">
                            <input 
                              type="file" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                              accept="image/*"
                              onChange={(e) => handleProjectImageUpload(project.id, 'beforeImage', e)}
                            />
                            {project.beforeImagePreview ? (
                              <div className="relative w-full h-full">
                                <Image 
                                  src={resolveImageUrl(project.beforeImagePreview) || ""} 
                                  alt="Before preview" 
                                  width={400} 
                                  height={300} 
                                  className="w-full h-full rounded-md object-cover"
                                  unoptimized
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeProjectImage(project.id, 'beforeImage');
                                  }}
                                  className="absolute -top-2 -right-2 bg-white border border-gray-300 text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 shadow-lg"
                                  title="Remove image"
                                >
                                  <i className="fas fa-trash text-sm"></i>
                                </button>
                              </div>
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex flex-col items-center justify-center">
                                <i className="fas fa-image text-2xl text-gray-400 mb-2"></i>
                                <p className="text-sm text-gray-600">Before Image</p>
                                <p className="text-xs text-gray-500">Click to upload</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          After Image
                          <span className="text-gray-500 text-xs font-normal ml-2">(Optional)</span>
                        </label>
                        <div className="relative group">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors duration-300 cursor-pointer h-40 flex flex-col items-center justify-center">
                            <input 
                              type="file" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                              accept="image/*"
                              onChange={(e) => handleProjectImageUpload(project.id, 'afterImage', e)}
                            />
                            {project.afterImagePreview ? (
                              <div className="relative w-full h-full">
                                <Image 
                                  src={resolveImageUrl(project.afterImagePreview) || ""} 
                                  alt="After preview" 
                                  width={400} 
                                  height={300} 
                                  className="w-full h-full rounded-md object-cover"
                                  unoptimized
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeProjectImage(project.id, 'afterImage');
                                  }}
                                  className="absolute -top-2 -right-2 bg-white border border-gray-300 text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 shadow-lg"
                                  title="Remove image"
                                >
                                  <i className="fas fa-trash text-sm"></i>
                                </button>
                              </div>
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-green-50 to-emerald-100 rounded-md flex flex-col items-center justify-center">
                                <i className="fas fa-image text-2xl text-emerald-400 mb-2"></i>
                                <p className="text-sm text-gray-600">After Image</p>
                                <p className="text-xs text-gray-500">Click to upload</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeProject(project.id)}
                          className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          <i className="fas fa-trash"></i>
                          Remove Project
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Awards & Recognition */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <SectionHeader 
              icon="fa-medal"
              title="Awards & Recognition"
              subtitle="Showcase your achievements and certifications"
            />
            <div className="relative">
              <textarea 
                rows={6}
                value={awardsRecognition}
                onChange={(e) => {
                  setAwardsRecognition(e.target.value);
                  handleFieldChange('awardsRecognition', e.target.value);
                }}
                className={`w-full px-4 py-3 border ${validationErrors.awardsRecognition ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900`}
                placeholder="List your awards, certifications, recognitions, and achievements in the construction and design industry..."
              />
              <div className="flex justify-between items-center mt-2">
                <ValidationMessage message={validationErrors.awardsRecognition} />
                <div className="text-sm text-gray-500">
                  <span className={awardsRecognition.length < 20 ? 'text-red-500' : 'text-green-500'}>
                    {awardsRecognition.length}
                  </span>
                  /20 minimum characters
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-gray-900 text-lg mb-1">Ready to Publish?</h3>
                <p className="text-gray-600 text-sm">
                  {isFormValid 
                    ? 'Your profile is complete and ready to be published.'
                    : 'Complete all required fields to publish your profile.'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button 
                  type="button" 
                  onClick={previewProfile}
                  disabled={!isFormValid}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isFormValid 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:scale-105' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                >
                  <i className="fas fa-eye"></i>
                  Preview Profile
                </button>
                
                <button 
                  type="submit"
                  onClick={saveProfile}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${!isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg hover:scale-105' 
                    : 'bg-blue-400 text-white cursor-wait'}`}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Form Status Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <div className={`flex items-center gap-2 ${!validationErrors.companyName && companyName ? 'text-green-600' : 'text-gray-600'}`}>
                  <i className={`fas ${!validationErrors.companyName && companyName ? 'fa-check-circle' : 'fa-circle'} text-xs`}></i>
                  <span>Company Name</span>
                </div>
                <div className={`flex items-center gap-2 ${!validationErrors.categories && categories.length > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                  <i className={`fas ${!validationErrors.categories && categories.length > 0 ? 'fa-check-circle' : 'fa-circle'} text-xs`}></i>
                  <span>Categories</span>
                </div>
                <div className={`flex items-center gap-2 ${!validationErrors.services && services.length > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                  <i className={`fas ${!validationErrors.services && services.length > 0 ? 'fa-check-circle' : 'fa-circle'} text-xs`}></i>
                  <span>Services</span>
                </div>
                <div className={`flex items-center gap-2 ${!validationErrors.email && validateEmail(email) ? 'text-green-600' : 'text-gray-600'}`}>
                  <i className={`fas ${!validationErrors.email && validateEmail(email) ? 'fa-check-circle' : 'fa-circle'} text-xs`}></i>
                  <span>Email</span>
                </div>
                <div className={`flex items-center gap-2 ${!validationErrors.teamMembers && teamMembers.every(m => m.name && m.qualification && m.role) ? 'text-green-600' : 'text-gray-600'}`}>
                  <i className={`fas ${!validationErrors.teamMembers && teamMembers.every(m => m.name && m.qualification && m.role) ? 'fa-check-circle' : 'fa-circle'} text-xs`}></i>
                  <span>Team Members</span>
                </div>
                <div className={`flex items-center gap-2 ${!validationErrors.projects && projects.every(p => p.title && p.description.length >= 30) ? 'text-green-600' : 'text-gray-600'}`}>
                  <i className={`fas ${!validationErrors.projects && projects.every(p => p.title && p.description.length >= 30) ? 'fa-check-circle' : 'fa-circle'} text-xs`}></i>
                  <span>Projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Showcase */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Industry Excellence Showcase</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore examples of outstanding work in the construction and design industry</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative overflow-hidden rounded-2xl group">
              <Image 
                src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Modern Architecture" 
                width={600} 
                height={400} 
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                <p className="text-white font-semibold text-lg">Modern Architecture</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl group">
              <Image 
                src="https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Interior Design" 
                width={600} 
                height={400} 
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                <p className="text-white font-semibold text-lg">Luxury Interiors</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl group">
              <Image 
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Construction" 
                width={600} 
                height={400} 
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                <p className="text-white font-semibold text-lg">Quality Construction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPreview(false)}></div>
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <i className="fas fa-eye text-white"></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Profile Preview</h2>
                      <p className="text-gray-600 text-sm">This is how your profile will appear to clients</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPreview(false)}
                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <i className="fas fa-times text-xl text-gray-500"></i>
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-8">
                <div className="max-w-4xl mx-auto space-y-12">
                  {/* Company Header */}
                  <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200">
                    <div className="relative">
                      {fileUploadState.logoPreview && (fileUploadState.logoPreview.startsWith('http') || fileUploadState.logoPreview.startsWith('/')) ? (
                        <Image 
                          src={resolveImageUrl(fileUploadState.logoPreview) || ""} 
                          alt="Logo" 
                          width={128} 
                          height={128} 
                          className="w-32 h-32 rounded-2xl object-cover shadow-lg border-4 border-white"
                          unoptimized
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                          <i className="fas fa-building text-3xl text-blue-400"></i>
                        </div>
                      )}
                    </div>
                    <div className="text-center md:text-left">
                      <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Verified</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">Est. {establishedYear}</span>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{companyName || 'Company Name'}</h1>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                        {categories.map(cat => (
                          <span key={cat} className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-6 text-sm text-gray-600 justify-center md:justify-start">
                        <span className="flex items-center gap-2">
                          <i className="fas fa-map-marker-alt text-blue-500"></i>
                          {location || 'Location'}
                        </span>
                        <span className="flex items-center gap-2">
                          <i className="fas fa-phone text-blue-500"></i>
                          {phone || 'Phone'}
                        </span>
                        <span className="flex items-center gap-2">
                          <i className="fas fa-envelope text-blue-500"></i>
                          {email || 'Email'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{consultationFee || '0'}</div>
                      <div className="text-sm text-gray-600">Consultation Fee</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">{projectsCompleted || '0'}</div>
                      <div className="text-sm text-gray-600">Projects Completed</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-amber-600 mb-1">{happyCustomers || '0'}</div>
                      <div className="text-sm text-gray-600">Happy Clients</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{awardsWon || '0'}</div>
                      <div className="text-sm text-gray-600">Awards Won</div>
                    </div>
                  </div>
                  
                  {/* Overview */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-book-open text-blue-500"></i>
                      Company Overview
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{overview || 'No overview provided.'}</p>
                  </div>
                  
                  {/* Services */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="fas fa-cogs text-blue-500"></i>
                      Services Offered
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {services.map(service => (
                        <span key={service} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Awards & Recognition */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
  <i className="fas fa-medal text-blue-500"></i>
                      Awards & Recognition
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{awardsRecognition || 'No awards or recognition listed.'}</p>
                  </div>
                  
                  {/* Team Preview */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <i className="fas fa-users text-blue-500"></i>
                      Our Team
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {teamMembers.map(member => (
                        <div key={member.id} className="text-center">
                          <div className="relative mx-auto mb-4">
                            {member.photoPreview && (member.photoPreview.startsWith('http') || member.photoPreview.startsWith('/')) ? (
                              <Image 
                                src={member.photoPreview} 
                                alt={member.name} 
                                width={96} 
                                height={96} 
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                              />
                            ) : (
                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                                <i className="fas fa-user text-2xl text-gray-400"></i>
                              </div>
                            )}
                          </div>
                          <h4 className="font-bold text-gray-900 mb-1">{member.name || 'Team Member'}</h4>
                          <p className="text-blue-600 text-sm font-medium mb-1">{member.role || 'Role'}</p>
                          <p className="text-gray-600 text-sm">{member.qualification || 'Qualification'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Projects Preview */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <i className="fas fa-project-diagram text-blue-500"></i>
                      Featured Projects
                    </h3>
                    <div className="space-y-8">
                      {projects.map(project => (
                        <div key={project.id} className="border border-gray-200 rounded-xl p-5">
                          <h4 className="text-lg font-bold text-gray-900 mb-3">{project.title || 'Project Title'}</h4>
                          <p className="text-gray-700 mb-4">{project.description || 'Project description goes here...'}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900 mb-2">Before</div>
                              {project.beforeImagePreview && (project.beforeImagePreview.startsWith('http') || project.beforeImagePreview.startsWith('/')) ? (
                                <Image 
                                  src={project.beforeImagePreview} 
                                  alt="Before" 
                                  width={400} 
                                  height={300} 
                                  className="w-full h-48 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                  <i className="fas fa-image text-3xl text-gray-400"></i>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 mb-2">After</div>
                              {project.afterImagePreview && (project.afterImagePreview.startsWith('http') || project.afterImagePreview.startsWith('/')) ? (
                                <Image 
                                  src={project.afterImagePreview} 
                                  alt="After" 
                                  width={400} 
                                  height={300} 
                                  className="w-full h-48 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg flex items-center justify-center">
                                  <i className="fas fa-image text-3xl text-emerald-400"></i>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-5">
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button 
                    onClick={() => setShowPreview(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back to Editor
                  </button>
                  <button 
                    onClick={saveProfile}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-check"></i>
                    Confirm & Publish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}