import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LinearScale from '../components/LinearScale';
import './Apply.css';

// Form configuration - entry IDs from Google Form
const FORM_CONFIG = {
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdMWfO4E1qu7rXLQmoP4OAm8H7fxbwEIQ6JcA5iymrxBdGMrA/formResponse',
    fields: {
        // Common fields
        email: 'entry.1026846730',
        name: 'entry.1717546578',
        age: 'entry.1388774102',
        contact: 'entry.840684034',
        occupation: 'entry.1549407303',
        institute: 'entry.1781195273',
        ahmedabadBased: 'entry.1331769159',
        linkedin: 'entry.381169301',
        team: 'entry.1429642501',
        aboutYou: 'entry.1428196788',
        verificationToken: 'entry.1023342376',
        // Content Team
        content_jobDescription: 'entry.1535673276',
        content_experience: 'entry.964487492',
        content_writeReadFreq: 'entry.1885360221',
        content_portfolio: 'entry.1149567092',
        // Curation Team
        curation_jobDescription: 'entry.1790620413',
        curation_experience: 'entry.468220834',
        curation_interactionComfort: 'entry.1525834424',
        curation_eventFreq: 'entry.437451358',
        // Design Team
        design_jobDescription: 'entry.1549612040',
        design_experience: 'entry.1753202726',
        design_softwares: 'entry.1112293906',
        design_feedback: 'entry.313037515',
        design_components: 'entry.1844741522',
        // Host Team
        host_jobDescription: 'entry.166824347',
        host_experience: 'entry.147142827',
        host_aboutYourself: 'entry.386957153',
        host_videoApproach: 'entry.2135115575',
        // Operations Team
        operations_jobDescription: 'entry.661139230',
        operations_experience: 'entry.1589196483',
        operations_emergencyHandling: 'entry.286011767',
        // Marketing Team
        marketing_jobDescription: 'entry.1890877642',
        marketing_experience: 'entry.2028998771',
        marketing_qualities: 'entry.141447402',
        marketing_techniques: 'entry.799854378',
        marketing_sponsorship: 'entry.2038817037',
        // Production Team
        production_jobDescription: 'entry.115644013',
        production_experience: 'entry.1290605670',
        production_softwares: 'entry.1930009479',
        production_portfolioLink: 'entry.584866381',
        production_comfortableLearning: 'entry.284700778'
    }
};

const teams = [
    { id: 'Marketing', name: 'Marketing', icon: '📢', description: 'Spread the word and build brand presence' },
    { id: 'Production/Video', name: 'Production/Video', icon: '🎬', description: 'Video editing and production' },
    { id: 'Content Writing', name: 'Content Writing', icon: '✍️', description: 'Craft compelling stories and narratives' },
    { id: 'Operations', name: 'Operations', icon: '⚙️', description: 'Ensure smooth logistics and management' },
    { id: 'Design Team', name: 'Design Team', icon: '🎨', description: 'Create stunning visual designs' },
    { id: 'Curation', name: 'Curation', icon: '🔍', description: 'Discover ideas worth spreading' },
    { id: 'Host Team', name: 'Host Team', icon: '🎤', description: 'Be the face and voice of our events' }
];

const occupations = [
    { value: 'Student', label: 'Student' },
    { value: 'Working', label: 'Working' }
];

const writeReadFrequencyOptions = [
    'Everyday',
    '2-3 times a week',
    'Once a week',
    'Once a month'
];

function Apply() {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        // Page 1 - Common fields
        name: '',
        age: '',
        contact: '',
        occupation: '',
        institute: '',
        ahmedabadBased: '',
        linkedin: '',
        team: '',

        // Content Team
        content_jobDescription: '',
        content_experience: '',
        content_writeReadFreq: '',
        content_portfolio: '',

        // Curation Team
        curation_jobDescription: '',
        curation_experience: '',
        curation_interactionComfort: '',
        curation_eventFreq: '',

        // Design Team
        design_jobDescription: '',
        design_experience: '',
        design_softwares: '',
        design_feedback: '',
        design_components: '',

        // Operations Team
        operations_jobDescription: '',
        operations_experience: '',
        operations_emergencyHandling: '',

        // Marketing Team
        marketing_jobDescription: '',
        marketing_experience: '',
        marketing_qualities: '',
        marketing_techniques: '',
        marketing_sponsorship: '',

        // Production Team
        production_jobDescription: '',
        production_experience: '',
        production_softwares: '',
        production_portfolioLink: '',
        production_comfortableLearning: '',

        // Host Team
        host_jobDescription: '',
        host_experience: '',
        host_aboutYourself: '',
        host_videoApproach: '',

        // Final section
        aboutYou: ''
    });

    const totalSteps = 4;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.name.trim()) newErrors.name = 'Name is required';
                if (!formData.age) newErrors.age = 'Age is required';
                else if (parseInt(formData.age) < 18) newErrors.age = 'Only 18+ can apply (No exceptions)';
                else if (parseInt(formData.age) > 99) newErrors.age = 'Please enter a valid age';
                if (!formData.contact.trim()) newErrors.contact = 'Contact number is required';
                else if (!/^\d{10}$/.test(formData.contact.replace(/\D/g, ''))) {
                    newErrors.contact = 'Please enter a valid 10-digit number';
                }
                break;
            case 2:
                if (!formData.occupation) newErrors.occupation = 'Please select your occupation';
                if (!formData.institute.trim()) newErrors.institute = 'Institute/Organization is required';
                if (!formData.ahmedabadBased) newErrors.ahmedabadBased = 'Please select an option';
                break;
            case 3:
                if (!formData.team) newErrors.team = 'Please select a team';
                break;
            case 4:
                // Team-specific validation
                const teamPrefix = getTeamPrefix();
                if (teamPrefix) {
                    if (!formData[`${teamPrefix}_jobDescription`]?.trim()) {
                        newErrors[`${teamPrefix}_jobDescription`] = 'This question is required';
                    }
                    if (!formData[`${teamPrefix}_experience`]?.trim()) {
                        newErrors[`${teamPrefix}_experience`] = 'This question is required';
                    }

                    // Additional required fields per team
                    if (teamPrefix === 'curation') {
                        if (!formData.curation_interactionComfort) {
                            newErrors.curation_interactionComfort = 'Please select a rating';
                        }
                        if (!formData.curation_eventFreq) {
                            newErrors.curation_eventFreq = 'Please select a rating';
                        }
                    }
                    if (teamPrefix === 'design') {
                        if (!formData.design_softwares?.trim()) {
                            newErrors.design_softwares = 'This question is required';
                        }
                        if (!formData.design_feedback?.trim()) {
                            newErrors.design_feedback = 'This question is required';
                        }
                        if (!formData.design_components?.trim()) {
                            newErrors.design_components = 'This question is required';
                        }
                    }
                    if (teamPrefix === 'operations') {
                        if (!formData.operations_emergencyHandling) {
                            newErrors.operations_emergencyHandling = 'Please select a rating';
                        }
                    }
                    if (teamPrefix === 'marketing') {
                        if (!formData.marketing_qualities?.trim()) {
                            newErrors.marketing_qualities = 'This question is required';
                        }
                        if (!formData.marketing_techniques?.trim()) {
                            newErrors.marketing_techniques = 'This question is required';
                        }
                        if (!formData.marketing_sponsorship) {
                            newErrors.marketing_sponsorship = 'Please select an option';
                        }
                    }
                    if (teamPrefix === 'production') {
                        if (!formData.production_comfortableLearning) {
                            newErrors.production_comfortableLearning = 'Please select an option';
                        }
                    }
                    if (teamPrefix === 'host') {
                        if (!formData.host_aboutYourself?.trim()) {
                            newErrors.host_aboutYourself = 'This question is required';
                        }
                        if (!formData.host_videoApproach?.trim()) {
                            newErrors.host_videoApproach = 'This question is required';
                        }
                    }
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getTeamPrefix = () => {
        const teamMap = {
            'Marketing': 'marketing',
            'Production/Video': 'production',
            'Content Writing': 'content',
            'Operations': 'operations',
            'Design Team': 'design',
            'Curation': 'curation',
            'Host Team': 'host'
        };
        return teamMap[formData.team] || '';
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);

        try {
            // Get verification token from backend
            const tokenResponse = await fetch('/.netlify/functions/generate-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }),
                credentials: 'include'
            });

            if (!tokenResponse.ok) {
                throw new Error('Failed to generate verification token');
            }

            const { token } = await tokenResponse.json();

            // Prepare form data for Google Form submission
            const submitData = new FormData();
            submitData.append(FORM_CONFIG.fields.email, user.email);
            submitData.append(FORM_CONFIG.fields.name, formData.name);
            submitData.append(FORM_CONFIG.fields.age, formData.age);
            submitData.append(FORM_CONFIG.fields.contact, formData.contact);
            submitData.append(FORM_CONFIG.fields.occupation, formData.occupation);
            submitData.append(FORM_CONFIG.fields.institute, formData.institute);
            submitData.append(FORM_CONFIG.fields.ahmedabadBased, formData.ahmedabadBased);
            submitData.append(FORM_CONFIG.fields.linkedin, formData.linkedin || '');
            submitData.append(FORM_CONFIG.fields.team, formData.team);
            submitData.append(FORM_CONFIG.fields.aboutYou, formData.aboutYou || '');
            submitData.append(FORM_CONFIG.fields.verificationToken, token);

            // Add team-specific questions based on selected team
            const teamPrefix = getTeamPrefix();
            if (teamPrefix === 'content') {
                submitData.append(FORM_CONFIG.fields.content_jobDescription, formData.content_jobDescription || '');
                submitData.append(FORM_CONFIG.fields.content_experience, formData.content_experience || '');
                submitData.append(FORM_CONFIG.fields.content_writeReadFreq, formData.content_writeReadFreq || '');
                submitData.append(FORM_CONFIG.fields.content_portfolio, formData.content_portfolio || '');
            } else if (teamPrefix === 'curation') {
                submitData.append(FORM_CONFIG.fields.curation_jobDescription, formData.curation_jobDescription || '');
                submitData.append(FORM_CONFIG.fields.curation_experience, formData.curation_experience || '');
                submitData.append(FORM_CONFIG.fields.curation_interactionComfort, formData.curation_interactionComfort || '');
                submitData.append(FORM_CONFIG.fields.curation_eventFreq, formData.curation_eventFreq || '');
            } else if (teamPrefix === 'design') {
                submitData.append(FORM_CONFIG.fields.design_jobDescription, formData.design_jobDescription || '');
                submitData.append(FORM_CONFIG.fields.design_experience, formData.design_experience || '');
                submitData.append(FORM_CONFIG.fields.design_softwares, formData.design_softwares || '');
                submitData.append(FORM_CONFIG.fields.design_feedback, formData.design_feedback || '');
                submitData.append(FORM_CONFIG.fields.design_components, formData.design_components || '');
            } else if (teamPrefix === 'host') {
                submitData.append(FORM_CONFIG.fields.host_jobDescription, formData.host_jobDescription || '');
                submitData.append(FORM_CONFIG.fields.host_experience, formData.host_experience || '');
                submitData.append(FORM_CONFIG.fields.host_aboutYourself, formData.host_aboutYourself || '');
                submitData.append(FORM_CONFIG.fields.host_videoApproach, formData.host_videoApproach || '');
            } else if (teamPrefix === 'operations') {
                submitData.append(FORM_CONFIG.fields.operations_jobDescription, formData.operations_jobDescription || '');
                submitData.append(FORM_CONFIG.fields.operations_experience, formData.operations_experience || '');
                submitData.append(FORM_CONFIG.fields.operations_emergencyHandling, formData.operations_emergencyHandling || '');
            } else if (teamPrefix === 'marketing') {
                submitData.append(FORM_CONFIG.fields.marketing_jobDescription, formData.marketing_jobDescription || '');
                submitData.append(FORM_CONFIG.fields.marketing_experience, formData.marketing_experience || '');
                submitData.append(FORM_CONFIG.fields.marketing_qualities, formData.marketing_qualities || '');
                submitData.append(FORM_CONFIG.fields.marketing_techniques, formData.marketing_techniques || '');
                submitData.append(FORM_CONFIG.fields.marketing_sponsorship, formData.marketing_sponsorship || '');
            } else if (teamPrefix === 'production') {
                submitData.append(FORM_CONFIG.fields.production_jobDescription, formData.production_jobDescription || '');
                submitData.append(FORM_CONFIG.fields.production_experience, formData.production_experience || '');
                submitData.append(FORM_CONFIG.fields.production_softwares, formData.production_softwares || '');
                submitData.append(FORM_CONFIG.fields.production_portfolioLink, formData.production_portfolioLink || '');
                submitData.append(FORM_CONFIG.fields.production_comfortableLearning, formData.production_comfortableLearning || '');
            }

            // Submit to Google Form
            await fetch(FORM_CONFIG.formUrl, {
                method: 'POST',
                body: submitData,
                mode: 'no-cors' // Required for Google Forms
            });

            setSubmitSuccess(true);

        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render team-specific questions
    const renderTeamQuestions = () => {
        const teamPrefix = getTeamPrefix();

        switch (teamPrefix) {
            case 'content':
                return (
                    <>
                        <div className="form-group">
                            <label className="form-label required">
                                What according to you is a job description for a "Content Writer"?
                            </label>
                            <textarea
                                name="content_jobDescription"
                                value={formData.content_jobDescription}
                                onChange={handleChange}
                                className={`form-textarea ${errors.content_jobDescription ? 'error' : ''}`}
                                placeholder="Describe the role of a content writer..."
                                rows={4}
                            />
                            {errors.content_jobDescription && (
                                <span className="form-error">{errors.content_jobDescription}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                Any relevant experience in this domain?
                            </label>
                            <textarea
                                name="content_experience"
                                value={formData.content_experience}
                                onChange={handleChange}
                                className={`form-textarea ${errors.content_experience ? 'error' : ''}`}
                                placeholder="Share your content writing experience..."
                                rows={4}
                            />
                            {errors.content_experience && (
                                <span className="form-error">{errors.content_experience}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">How often do you write/read?</label>
                            <div className="radio-group">
                                {writeReadFrequencyOptions.map(option => (
                                    <label
                                        key={option}
                                        className={`radio-option ${formData.content_writeReadFreq === option ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="content_writeReadFreq"
                                            value={option}
                                            checked={formData.content_writeReadFreq === option}
                                            onChange={handleChange}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Add your work (Portfolio link)</label>
                            <input
                                type="url"
                                name="content_portfolio"
                                value={formData.content_portfolio}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="https://your-portfolio.com or Google Drive link"
                            />
                            <span className="form-hint">Share a link to your writing samples or portfolio</span>
                        </div>
                    </>
                );

            case 'curation':
                return (
                    <>
                        <div className="form-group">
                            <label className="form-label required">
                                What according to you is the work for a "Curator"?
                            </label>
                            <textarea
                                name="curation_jobDescription"
                                value={formData.curation_jobDescription}
                                onChange={handleChange}
                                className={`form-textarea ${errors.curation_jobDescription ? 'error' : ''}`}
                                placeholder="Describe what a curator does..."
                                rows={4}
                            />
                            {errors.curation_jobDescription && (
                                <span className="form-error">{errors.curation_jobDescription}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                Any relevant experience in this domain?
                            </label>
                            <textarea
                                name="curation_experience"
                                value={formData.curation_experience}
                                onChange={handleChange}
                                className={`form-textarea ${errors.curation_experience ? 'error' : ''}`}
                                placeholder="Share your relevant experience..."
                                rows={4}
                            />
                            {errors.curation_experience && (
                                <span className="form-error">{errors.curation_experience}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                How comfortable you find yourself interacting with different people?
                            </label>
                            <LinearScale
                                name="curation_interactionComfort"
                                value={formData.curation_interactionComfort}
                                onChange={handleChange}
                                min={1}
                                max={10}
                                minLabel="Not comfortable"
                                maxLabel="Very comfortable"
                                error={errors.curation_interactionComfort}
                            />
                            {errors.curation_interactionComfort && (
                                <span className="form-error">{errors.curation_interactionComfort}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                How often do you attend events/workshops around you?
                            </label>
                            <LinearScale
                                name="curation_eventFreq"
                                value={formData.curation_eventFreq}
                                onChange={handleChange}
                                min={1}
                                max={10}
                                minLabel="Rarely"
                                maxLabel="Very frequently"
                                error={errors.curation_eventFreq}
                            />
                            {errors.curation_eventFreq && (
                                <span className="form-error">{errors.curation_eventFreq}</span>
                            )}
                        </div>
                    </>
                );

            case 'design':
                return (
                    <>
                        <div className="form-group">
                            <label className="form-label required">
                                What according to you is a job description for a "Graphic Designer"?
                            </label>
                            <textarea
                                name="design_jobDescription"
                                value={formData.design_jobDescription}
                                onChange={handleChange}
                                className={`form-textarea ${errors.design_jobDescription ? 'error' : ''}`}
                                placeholder="Describe the role of a graphic designer..."
                                rows={4}
                            />
                            {errors.design_jobDescription && (
                                <span className="form-error">{errors.design_jobDescription}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Any relevant experience in this domain?
                            </label>
                            <textarea
                                name="design_experience"
                                value={formData.design_experience}
                                onChange={handleChange}
                                className="form-textarea"
                                placeholder="Share your design experience..."
                                rows={4}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                What software programs you can operate (create design) on?
                            </label>
                            <input
                                type="text"
                                name="design_softwares"
                                value={formData.design_softwares}
                                onChange={handleChange}
                                className={`form-input ${errors.design_softwares ? 'error' : ''}`}
                                placeholder="Eg. Adobe Photoshop, Canva, Illustrator, InDesign etc."
                            />
                            {errors.design_softwares && (
                                <span className="form-error">{errors.design_softwares}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                How do you incorporate feedback into your designs?
                            </label>
                            <textarea
                                name="design_feedback"
                                value={formData.design_feedback}
                                onChange={handleChange}
                                className={`form-textarea ${errors.design_feedback ? 'error' : ''}`}
                                placeholder="Describe your feedback process..."
                                rows={4}
                            />
                            {errors.design_feedback && (
                                <span className="form-error">{errors.design_feedback}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                What according to you are some crucial components in a design?
                            </label>
                            <textarea
                                name="design_components"
                                value={formData.design_components}
                                onChange={handleChange}
                                className={`form-textarea ${errors.design_components ? 'error' : ''}`}
                                placeholder="Share your thoughts on essential design elements..."
                                rows={4}
                            />
                            {errors.design_components && (
                                <span className="form-error">{errors.design_components}</span>
                            )}
                        </div>
                    </>
                );

            case 'operations':
                return (
                    <>
                        <div className="form-group">
                            <label className="form-label required">
                                What according to you is a job description for an "Operations Executive"?
                            </label>
                            <textarea
                                name="operations_jobDescription"
                                value={formData.operations_jobDescription}
                                onChange={handleChange}
                                className={`form-textarea ${errors.operations_jobDescription ? 'error' : ''}`}
                                placeholder="Describe the role of an operations executive..."
                                rows={4}
                            />
                            {errors.operations_jobDescription && (
                                <span className="form-error">{errors.operations_jobDescription}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                Any relevant experience in this domain?
                            </label>
                            <textarea
                                name="operations_experience"
                                value={formData.operations_experience}
                                onChange={handleChange}
                                className={`form-textarea ${errors.operations_experience ? 'error' : ''}`}
                                placeholder="Share your operations experience..."
                                rows={4}
                            />
                            {errors.operations_experience && (
                                <span className="form-error">{errors.operations_experience}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                How comfortable are you when it comes to managing emergencies and coming up with real time solutions?
                            </label>
                            <LinearScale
                                name="operations_emergencyHandling"
                                value={formData.operations_emergencyHandling}
                                onChange={handleChange}
                                min={1}
                                max={10}
                                minLabel="Not comfortable"
                                maxLabel="Very comfortable"
                                error={errors.operations_emergencyHandling}
                            />
                            {errors.operations_emergencyHandling && (
                                <span className="form-error">{errors.operations_emergencyHandling}</span>
                            )}
                        </div>
                    </>
                );

            case 'marketing':
                return (
                    <>
                        <div className="form-group">
                            <label className="form-label required">
                                What according to you is the work for a "Marketer"?
                            </label>
                            <textarea
                                name="marketing_jobDescription"
                                value={formData.marketing_jobDescription}
                                onChange={handleChange}
                                className={`form-textarea ${errors.marketing_jobDescription ? 'error' : ''}`}
                                placeholder="Describe the role of a marketer..."
                                rows={4}
                            />
                            {errors.marketing_jobDescription && (
                                <span className="form-error">{errors.marketing_jobDescription}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                Any relevant experience in this domain?
                            </label>
                            <textarea
                                name="marketing_experience"
                                value={formData.marketing_experience}
                                onChange={handleChange}
                                className={`form-textarea ${errors.marketing_experience ? 'error' : ''}`}
                                placeholder="Share your marketing experience..."
                                rows={4}
                            />
                            {errors.marketing_experience && (
                                <span className="form-error">{errors.marketing_experience}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                What qualities in you makes you suitable member for marketing team?
                            </label>
                            <textarea
                                name="marketing_qualities"
                                value={formData.marketing_qualities}
                                onChange={handleChange}
                                className={`form-textarea ${errors.marketing_qualities ? 'error' : ''}`}
                                placeholder="Describe your marketing qualities..."
                                rows={4}
                            />
                            {errors.marketing_qualities && (
                                <span className="form-error">{errors.marketing_qualities}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                What according to you are some good marketing techniques for a women empowerment event?
                            </label>
                            <textarea
                                name="marketing_techniques"
                                value={formData.marketing_techniques}
                                onChange={handleChange}
                                className={`form-textarea ${errors.marketing_techniques ? 'error' : ''}`}
                                placeholder="Share your ideas for marketing a women empowerment event..."
                                rows={4}
                            />
                            {errors.marketing_techniques && (
                                <span className="form-error">{errors.marketing_techniques}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                Do you have any prior experience in getting sponsorship for any event/organization?
                            </label>
                            <div className="radio-group horizontal">
                                <label className={`radio-option ${formData.marketing_sponsorship === 'Yes' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="marketing_sponsorship"
                                        value="Yes"
                                        checked={formData.marketing_sponsorship === 'Yes'}
                                        onChange={handleChange}
                                    />
                                    Yes
                                </label>
                                <label className={`radio-option ${formData.marketing_sponsorship === 'No' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="marketing_sponsorship"
                                        value="No"
                                        checked={formData.marketing_sponsorship === 'No'}
                                        onChange={handleChange}
                                    />
                                    No
                                </label>
                            </div>
                            {errors.marketing_sponsorship && (
                                <span className="form-error">{errors.marketing_sponsorship}</span>
                            )}
                        </div>
                    </>
                );

            case 'production':
                return (
                    <>
                        <div className="form-group">
                            <label className="form-label required">
                                What according to you is the work for a "Production Executive"?
                            </label>
                            <input
                                type="text"
                                name="production_jobDescription"
                                value={formData.production_jobDescription}
                                onChange={handleChange}
                                className={`form-input ${errors.production_jobDescription ? 'error' : ''}`}
                                placeholder="Briefly describe the role..."
                            />
                            {errors.production_jobDescription && (
                                <span className="form-error">{errors.production_jobDescription}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                Any relevant experience in this domain?
                            </label>
                            <textarea
                                name="production_experience"
                                value={formData.production_experience}
                                onChange={handleChange}
                                className={`form-textarea ${errors.production_experience ? 'error' : ''}`}
                                placeholder="Share your production/video editing experience..."
                                rows={4}
                            />
                            {errors.production_experience && (
                                <span className="form-error">{errors.production_experience}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                What software programs you can work with?
                            </label>
                            <input
                                type="text"
                                name="production_softwares"
                                value={formData.production_softwares}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Eg. iMovies, Premiere Pro, After Effects, Lightworks etc."
                            />
                            <span className="form-hint">If not any, just mention a few that you might be interested in learning</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Link to some previous content
                            </label>
                            <input
                                type="url"
                                name="production_portfolioLink"
                                value={formData.production_portfolioLink}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="https://youtube.com/... or drive link"
                            />
                            <span className="form-hint">Attach a link of any production or video editing work you have done</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                Are you comfortable learning new skills/software when needed?
                            </label>
                            <div className="radio-group horizontal">
                                <label className={`radio-option ${formData.production_comfortableLearning === 'Yes' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="production_comfortableLearning"
                                        value="Yes"
                                        checked={formData.production_comfortableLearning === 'Yes'}
                                        onChange={handleChange}
                                    />
                                    Yes
                                </label>
                                <label className={`radio-option ${formData.production_comfortableLearning === 'No' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="production_comfortableLearning"
                                        value="No"
                                        checked={formData.production_comfortableLearning === 'No'}
                                        onChange={handleChange}
                                    />
                                    No
                                </label>
                            </div>
                            {errors.production_comfortableLearning && (
                                <span className="form-error">{errors.production_comfortableLearning}</span>
                            )}
                        </div>
                    </>
                );

            case 'host':
                return (
                    <>
                        <div className="form-group">
                            <label className="form-label required">
                                What according to you is a job description for a "Host"?
                            </label>
                            <textarea
                                name="host_jobDescription"
                                value={formData.host_jobDescription}
                                onChange={handleChange}
                                className={`form-textarea ${errors.host_jobDescription ? 'error' : ''}`}
                                placeholder="Describe the role of a host..."
                                rows={4}
                            />
                            {errors.host_jobDescription && (
                                <span className="form-error">{errors.host_jobDescription}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                Any relevant experience in this domain?
                            </label>
                            <textarea
                                name="host_experience"
                                value={formData.host_experience}
                                onChange={handleChange}
                                className={`form-textarea ${errors.host_experience ? 'error' : ''}`}
                                placeholder="Share your hosting/anchoring experience..."
                                rows={4}
                            />
                            {errors.host_experience && (
                                <span className="form-error">{errors.host_experience}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                Describe yourself and your qualities briefly.
                            </label>
                            <textarea
                                name="host_aboutYourself"
                                value={formData.host_aboutYourself}
                                onChange={handleChange}
                                className={`form-textarea ${errors.host_aboutYourself ? 'error' : ''}`}
                                placeholder="Tell us about your personality and qualities..."
                                rows={4}
                            />
                            {errors.host_aboutYourself && (
                                <span className="form-error">{errors.host_aboutYourself}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">
                                How would you approach to record a video for online promotions of our event?
                            </label>
                            <textarea
                                name="host_videoApproach"
                                value={formData.host_videoApproach}
                                onChange={handleChange}
                                className={`form-textarea ${errors.host_videoApproach ? 'error' : ''}`}
                                placeholder="Describe your approach to creating promotional video content..."
                                rows={4}
                            />
                            {errors.host_videoApproach && (
                                <span className="form-error">{errors.host_videoApproach}</span>
                            )}
                        </div>
                    </>
                );

            default:
                return <p className="text-center">Please select a team in the previous step.</p>;
        }
    };

    if (submitSuccess) {
        return (
            <div className="apply-page">
                <div className="container">
                    <div className="success-card">
                        <div className="success-icon">✓</div>
                        <h1>Application Submitted!</h1>
                        <p>
                            Thank you for applying to join TEDxPrahladnagar 2025.
                            We've received your application and our team will review it soon.
                        </p>
                        <div className="success-details">
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Team Applied For:</strong> {formData.team}</p>
                        </div>
                        <div className="success-disclaimer">
                            <p>
                                <strong>Note:</strong> Completing the online application form does not guarantee your selection.
                                You will be called for a virtual/online interview by our organizer and respective team leaders,
                                post which you will receive your confirmation email.
                            </p>
                        </div>
                        <a href="/status" className="btn btn-primary">
                            Check Application Status
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="apply-page">
            <div className="container">
                <div className="apply-header">
                    <h1>Apply to Join <span className="text-red">TEDx</span>Prahladnagar</h1>
                    <p>Team Application: TEDxPrahladnagar 2025</p>
                    <p className="apply-subtitle">
                        TEDxPrahladnagar strives to explore & celebrate ingenious perspectives.
                        Join our team and grow with us!
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-bar">
                        {[1, 2, 3, 4].map(step => (
                            <div
                                key={step}
                                className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                            />
                        ))}
                    </div>
                    <div className="progress-labels">
                        <span className={currentStep >= 1 ? 'active' : ''}>Personal</span>
                        <span className={currentStep >= 2 ? 'active' : ''}>Professional</span>
                        <span className={currentStep >= 3 ? 'active' : ''}>Team</span>
                        <span className={currentStep >= 4 ? 'active' : ''}>Questions</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="apply-form">
                    {/* Email Display */}
                    <div className="email-display">
                        <label className="form-label">Email Address (from Google Account)</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="form-input locked"
                        />
                        <span className="verified-badge">✓ Verified</span>
                    </div>

                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                        <div className="form-step animate-fade-in">
                            <h2>Personal Information</h2>

                            <div className="form-group">
                                <label className="form-label required">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`form-input ${errors.name ? 'error' : ''}`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && <span className="form-error">{errors.name}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label required">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className={`form-input ${errors.age ? 'error' : ''}`}
                                        placeholder="Your age"
                                        min="18"
                                        max="99"
                                    />
                                    <span className="form-hint">Only 18+ can apply (No exceptions)</span>
                                    {errors.age && <span className="form-error">{errors.age}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label required">Contact Number</label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className={`form-input ${errors.contact ? 'error' : ''}`}
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                    {errors.contact && <span className="form-error">{errors.contact}</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Professional Information */}
                    {currentStep === 2 && (
                        <div className="form-step animate-fade-in">
                            <h2>Professional Details</h2>

                            <div className="form-group">
                                <label className="form-label required">Occupation</label>
                                <div className="radio-group horizontal">
                                    {occupations.map(occ => (
                                        <label
                                            key={occ.value}
                                            className={`radio-option ${formData.occupation === occ.value ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="occupation"
                                                value={occ.value}
                                                checked={formData.occupation === occ.value}
                                                onChange={handleChange}
                                            />
                                            {occ.label}
                                        </label>
                                    ))}
                                </div>
                                {errors.occupation && <span className="form-error">{errors.occupation}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label required">Institute</label>
                                <input
                                    type="text"
                                    name="institute"
                                    value={formData.institute}
                                    onChange={handleChange}
                                    className={`form-input ${errors.institute ? 'error' : ''}`}
                                    placeholder="Where do you study or work?"
                                />
                                <span className="form-hint">Please mention your current/last institute. Eg. Nirma University, B.Tech</span>
                                {errors.institute && <span className="form-error">{errors.institute}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label required">Are you based in Ahmedabad?</label>
                                <div className="radio-group horizontal">
                                    <label className={`radio-option ${formData.ahmedabadBased === 'Yes' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="ahmedabadBased"
                                            value="Yes"
                                            checked={formData.ahmedabadBased === 'Yes'}
                                            onChange={handleChange}
                                        />
                                        Yes
                                    </label>
                                    <label className={`radio-option ${formData.ahmedabadBased === 'No' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="ahmedabadBased"
                                            value="No"
                                            checked={formData.ahmedabadBased === 'No'}
                                            onChange={handleChange}
                                        />
                                        No
                                    </label>
                                </div>
                                <span className="form-hint">If "No", please mention which City, State, Country in the about section</span>
                                {errors.ahmedabadBased && <span className="form-error">{errors.ahmedabadBased}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Are you on LinkedIn?</label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="https://www.linkedin.com/in/yourprofile"
                                />
                                <span className="form-hint">If yes, please paste your profile link, and do connect with TEDxPrahladnagar on LinkedIn.</span>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Team Selection */}
                    {currentStep === 3 && (
                        <div className="form-step animate-fade-in">
                            <h2>Choose Your Team</h2>
                            <p className="mb-3">Willing to be a part of which team? Select the team you'd like to join based on your interests and skills.</p>

                            <div className="form-group">
                                <div className="team-grid">
                                    {teams.map(team => (
                                        <label
                                            key={team.id}
                                            className={`team-option ${formData.team === team.id ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="team"
                                                value={team.id}
                                                checked={formData.team === team.id}
                                                onChange={handleChange}
                                            />
                                            <span className="team-icon">{team.icon}</span>
                                            <span className="team-name">{team.name}</span>
                                            <span className="team-desc">{team.description}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.team && <span className="form-error">{errors.team}</span>}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Team-Specific Questions */}
                    {currentStep === 4 && (
                        <div className="form-step animate-fade-in">
                            <h2>{formData.team} - Team Questions</h2>
                            <p className="mb-3">Answer the following questions to help us understand your fit for the team.</p>

                            {renderTeamQuestions()}

                            <div className="form-divider"></div>

                            {/* About You Section */}
                            <div className="form-group">
                                <label className="form-label">Let us know something about you!</label>
                                <textarea
                                    name="aboutYou"
                                    value={formData.aboutYou}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="Tell us something interesting about yourself, your hobbies, passions, or anything you'd like us to know..."
                                    rows={4}
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="form-navigation">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="btn btn-secondary"
                                disabled={isSubmitting}
                            >
                                ← Previous
                            </button>
                        )}

                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="btn btn-primary"
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Application'
                                )}
                            </button>
                        )}
                    </div>
                </form>

                {/* Footer disclaimer */}
                <div className="apply-disclaimer">
                    <p>
                        <strong>Disclaimer:</strong> Completing this form does not guarantee selection.
                        You will be called for a virtual/online interview by our organizer and team leaders.
                    </p>
                    <p className="contact-info">
                        For queries: <a href="mailto:tedxprahladnagar@gmail.com">tedxprahladnagar@gmail.com</a>
                        <br />
                        Contact: Dev - +91 93441 72991 | Shlok - +91 99744 41199
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Apply;
