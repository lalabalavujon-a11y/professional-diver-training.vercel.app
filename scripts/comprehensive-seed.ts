import { db } from '../server/db.js';
import { tracks, lessons, quizzes, questions, aiTutors, practiceScenarios, certificates } from '../shared/schema.js';

async function comprehensiveSeed() {
  console.log('🌱 Seeding comprehensive diving education platform...');

  // Clear existing data in proper order
  await db.delete(questions);
  await db.delete(quizzes);
  await db.delete(practiceScenarios);
  await db.delete(lessons);
  await db.delete(certificates);
  await db.delete(tracks);
  await db.delete(aiTutors);

  // Create AI Tutors for each discipline
  const [ndtTutor] = await db.insert(aiTutors).values({
    name: "Dr. Sarah Chen",
    specialty: "NDT",
    description: "Expert in Non-Destructive Testing and Inspection with 15+ years in underwater inspection techniques, corrosion assessment, and CP surveying.",
    personality: {
      style: "methodical",
      approach: "detail-oriented",
      focus: "safety-first inspection procedures"
    },
    knowledgeBase: ["visual_inspection", "corrosion_assessment", "cp_surveying", "thickness_gauging", "magnetic_particle_inspection", "documentation"]
  }).returning();

  const [medicTutor] = await db.insert(aiTutors).values({
    name: "Dr. Michael Rodriguez",
    specialty: "Diver Medic Technician",
    description: "Emergency medicine specialist focused on diving-related medical emergencies, hyperbaric treatment, and underwater rescue protocols.",
    personality: {
      style: "urgent",
      approach: "protocol-driven",
      focus: "rapid assessment and life-saving procedures"
    },
    knowledgeBase: ["emergency_protocols", "airway_management", "circulation_assessment", "hyperbaric_medicine", "rescue_procedures"]
  }).returning();

  const [supervisorTutor] = await db.insert(aiTutors).values({
    name: "Captain James Mitchell",
    specialty: "Commercial Dive Supervisor",
    description: "Veteran dive supervisor with expertise in dive planning, risk assessment, and emergency response coordination for commercial diving operations.",
    personality: {
      style: "authoritative",
      approach: "risk-focused",
      focus: "comprehensive planning and safety management"
    },
    knowledgeBase: ["dive_planning", "risk_assessment", "emergency_response", "team_management", "quality_assurance"]
  }).returning();

  const [airDiverTutor] = await db.insert(aiTutors).values({
    name: "Lisa Thompson",
    specialty: "Air Diving",
    description: "Professional air diving instructor specializing in gas management, ascent procedures, and underwater tool handling safety.",
    personality: {
      style: "supportive",
      approach: "skill-building",
      focus: "fundamental diving skills and safety practices"
    },
    knowledgeBase: ["diving_physics", "gas_management", "ascent_procedures", "tool_handling", "basic_communications"]
  }).returning();

  const [satDiverTutor] = await db.insert(aiTutors).values({
    name: "Commander Robert Hayes",
    specialty: "Saturation Diving",
    description: "Saturation diving specialist with extensive experience in deep-sea operations, life support systems, and confined space protocols.",
    personality: {
      style: "precise",
      approach: "systems-focused",
      focus: "complex system operation and human factors"
    },
    knowledgeBase: ["saturation_systems", "life_support", "human_factors", "deep_sea_operations", "system_components"]
  }).returning();

  const [alstTutor] = await db.insert(aiTutors).values({
    name: "David Kim",
    specialty: "Assistant Life Support Technician",
    description: "Life support systems technician focused on gas management, environmental controls, and emergency procedures for diving operations.",
    personality: {
      style: "methodical",
      approach: "systematic",
      focus: "system operation and maintenance procedures"
    },
    knowledgeBase: ["life_support_systems", "gas_management", "environmental_controls", "emergency_procedures", "equipment_maintenance"]
  }).returning();

  const [lstTutor] = await db.insert(aiTutors).values({
    name: "Rebecca Foster",
    specialty: "Life Support Technician",
    description: "Senior life support technician with expertise in advanced systems, troubleshooting, and team leadership in critical operations.",
    personality: {
      style: "analytical",
      approach: "problem-solving",
      focus: "advanced system management and leadership"
    },
    knowledgeBase: ["advanced_life_support", "troubleshooting", "emergency_management", "team_leadership", "quality_assurance"]
  }).returning();

  // Create the 7 comprehensive training tracks
  const [ndtTrack] = await db.insert(tracks).values({
    title: "Inspection & Non-Destructive Testing (NDT)",
    slug: "inspection-ndt",
    summary: "Comprehensive training in underwater inspection techniques, corrosion assessment, cathodic protection surveying, and documentation standards for commercial diving operations.",
    aiTutorId: ndtTutor.id,
    difficulty: "intermediate",
    estimatedHours: 40,
    isPublished: true,
  }).returning();

  const [medicTrack] = await db.insert(tracks).values({
    title: "Diver Medic Technician",
    slug: "diver-medic-technician",
    summary: "Advanced medical training for diving emergencies, including scene assessment, ABCDE protocols, airway management, and emergency response procedures.",
    aiTutorId: medicTutor.id,
    difficulty: "advanced",
    estimatedHours: 60,
    isPublished: true,
  }).returning();

  const [supervisorTrack] = await db.insert(tracks).values({
    title: "Commercial Dive Supervisor",
    slug: "commercial-dive-supervisor",
    summary: "Leadership and management training covering dive planning, risk assessment, hazard identification, communication protocols, and emergency response coordination.",
    aiTutorId: supervisorTutor.id,
    difficulty: "advanced",
    estimatedHours: 80,
    isPublished: true,
  }).returning();

  const [airDiverTrack] = await db.insert(tracks).values({
    title: "Air Diver Certification",
    slug: "air-diver-certification",
    summary: "Fundamental air diving skills including diving physics, gas management, ascent procedures, problem-solving, and basic underwater communications.",
    aiTutorId: airDiverTutor.id,
    difficulty: "beginner",
    estimatedHours: 30,
    isPublished: true,
  }).returning();

  const [satDiverTrack] = await db.insert(tracks).values({
    title: "Saturation Diver Training",
    slug: "saturation-diver-training",
    summary: "Specialized training for saturation diving operations, system components, human factors in confined environments, and advanced life support systems.",
    aiTutorId: satDiverTutor.id,
    difficulty: "advanced",
    estimatedHours: 120,
    isPublished: true,
  }).returning();

  const [alstTrack] = await db.insert(tracks).values({
    title: "Assistant Life Support Technician (ALST)",
    slug: "assistant-life-support-technician",
    summary: "Essential training for life support system operation, gas management principles, environmental control systems, and emergency procedures.",
    aiTutorId: alstTutor.id,
    difficulty: "intermediate",
    estimatedHours: 50,
    isPublished: true,
  }).returning();

  const [lstTrack] = await db.insert(tracks).values({
    title: "Life Support Technician (LST)",
    slug: "life-support-technician",
    summary: "Advanced life support systems training, system design principles, troubleshooting methodologies, emergency management, and team leadership.",
    aiTutorId: lstTutor.id,
    difficulty: "advanced",
    estimatedHours: 70,
    isPublished: true,
  }).returning();

  // Create comprehensive lessons for NDT Track
  const [ndtLesson1] = await db.insert(lessons).values({
    trackId: ndtTrack.id,
    title: "Visual Inspection Fundamentals",
    order: 1,
    content: `# Visual Inspection Fundamentals

Visual inspection forms the foundation of underwater non-destructive testing. This comprehensive module covers industry-standard techniques and protocols.

## Learning Objectives
- Understand visual inspection principles and limitations
- Master systematic inspection methodologies
- Learn proper documentation techniques
- Identify common underwater structural issues

## Core Principles

### Systematic Approach
Visual inspection requires a methodical approach to ensure complete coverage:

1. **Pre-Inspection Planning**
   - Review structural drawings and previous inspection reports
   - Understand expected defect types and locations
   - Plan inspection routes and coverage areas
   - Prepare documentation templates

2. **Inspection Methodology**
   - **Grid Pattern Scanning**: Systematic coverage using overlapping grids
   - **Zone-Based Approach**: Dividing structures into manageable zones
   - **Critical Point Focus**: Concentrating on high-stress areas
   - **Comparative Analysis**: Comparing with baseline conditions

### Environmental Considerations
Underwater visual inspection faces unique challenges:
- **Visibility Limitations**: Water clarity, lighting, suspended particles
- **Current Effects**: Impact on diver stability and inspection quality  
- **Depth Considerations**: Narcosis effects and time limitations
- **Temperature Factors**: Equipment performance and diver comfort

## Inspection Techniques

### Surface Preparation
Before detailed inspection:
- **Marine Growth Removal**: Clean areas for detailed examination
- **Debris Clearance**: Remove obstructing materials
- **Surface Cleaning**: Use appropriate cleaning methods
- **Access Preparation**: Ensure safe working positions

### Detection Methods
- **Direct Visual Examination**: Close-up inspection with proper lighting
- **Pattern Recognition**: Identifying systematic defect patterns
- **Measurement Techniques**: Using underwater measurement tools
- **Photographic Documentation**: High-quality underwater photography

## Common Defect Types

### Corrosion Patterns
- **General Corrosion**: Uniform surface degradation
- **Pitting Corrosion**: Localized deep penetration
- **Crevice Corrosion**: Confined space corrosion
- **Galvanic Corrosion**: Dissimilar metal contact
- **Microbiologically Influenced Corrosion (MIC)**: Bacterial-induced deterioration

### Structural Issues
- **Fatigue Cracking**: Cyclical stress-induced failures
- **Weld Defects**: Joint integrity problems
- **Deformation**: Shape changes from overloading
- **Connection Failures**: Bolt, rivet, or weld problems

## Documentation Standards

### Recording Requirements
All observations must be systematically documented:
- **Location Identification**: Precise position references
- **Defect Descriptions**: Detailed characteristic documentation
- **Dimensional Data**: Accurate measurements
- **Photographic Evidence**: Multiple angles and scales

### Report Formats
- **Field Notes**: Real-time observation recording
- **Inspection Checklists**: Standardized coverage verification
- **Digital Documentation**: Electronic data management
- **Final Reports**: Comprehensive findings summaries

## Quality Assurance
Maintaining inspection quality through:
- **Calibration Procedures**: Equipment verification
- **Technique Validation**: Method effectiveness confirmation
- **Peer Review**: Independent verification processes
- **Continuous Training**: Skill maintenance and improvement

## Safety Protocols
Visual inspection safety considerations:
- **Proper Lighting**: Adequate illumination without thermal hazards
- **Tool Management**: Secure tool handling and positioning
- **Communication**: Clear reporting of findings and hazards
- **Emergency Procedures**: Response protocols for discovered hazards

Understanding these fundamentals provides the foundation for all subsequent NDT techniques and ensures consistent, reliable inspection results.`,
    objectives: ["Master systematic visual inspection techniques", "Understand defect identification principles", "Learn proper documentation methods", "Apply safety protocols"],
    estimatedMinutes: 45,
    isRequired: true,
  }).returning();

  // Create practice scenario for NDT
  await db.insert(practiceScenarios).values({
    lessonId: ndtLesson1.id,
    title: "Offshore Platform Leg Inspection",
    description: "Conduct a visual inspection of an offshore platform leg showing signs of corrosion and marine growth.",
    scenario: {
      environment: "offshore_platform",
      depth: "15 meters",
      visibility: "3 meters",
      current: "moderate",
      structure: "steel tubular leg with complex joint",
      issues: ["pitting_corrosion", "marine_growth", "weld_defects"],
      tools: ["underwater_camera", "measuring_tape", "cleaning_brush", "thickness_gauge"],
      timeLimit: 20
    },
    expectedActions: [
      "Remove marine growth from inspection area",
      "Document corrosion patterns with photographs",
      "Measure pit depths and affected areas",
      "Check weld integrity at joints",
      "Record findings systematically"
    ],
    difficulty: "intermediate",
    estimatedMinutes: 20,
  });

  // Create comprehensive quiz for NDT lesson
  const [ndtQuiz1] = await db.insert(quizzes).values({
    lessonId: ndtLesson1.id,
    title: "Visual Inspection Fundamentals Assessment",
    timeLimit: 20,
    examType: "QUIZ",
    passingScore: 80,
    maxAttempts: 3,
    showFeedback: true,
  }).returning();

  // Multiple choice questions
  await db.insert(questions).values([
    {
      quizId: ndtQuiz1.id,
      type: "MULTIPLE_CHOICE",
      prompt: "What is the most critical factor in underwater visual inspection planning?",
      options: ["Water temperature", "Systematic coverage methodology", "Diver experience level", "Equipment cost"],
      correctAnswer: "Systematic coverage methodology",
      explanation: "Systematic coverage methodology ensures complete inspection coverage and prevents missed areas, which is critical for safety and structural integrity.",
      points: 2,
      order: 1,
    },
    {
      quizId: ndtQuiz1.id,
      type: "TRUE_FALSE", 
      prompt: "Pitting corrosion is characterized by uniform surface degradation across large areas.",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: "Pitting corrosion is localized deep penetration, not uniform surface degradation. General corrosion shows uniform patterns.",
      points: 1,
      order: 2,
    },
    {
      quizId: ndtQuiz1.id,
      type: "SHORT_ANSWER",
      prompt: "List three environmental factors that can significantly impact underwater visual inspection quality.",
      options: [],
      correctAnswer: "visibility limitations, current effects, depth considerations, temperature factors",
      explanation: "Key factors include visibility (water clarity, lighting), current effects (diver stability), depth considerations (narcosis, time limits), and temperature (equipment/diver performance).",
      points: 3,
      order: 3,
    },
    {
      quizId: ndtQuiz1.id,
      type: "MULTIPLE_CHOICE",
      prompt: "Which corrosion type is most likely to occur at dissimilar metal connections?",
      options: ["General corrosion", "Pitting corrosion", "Galvanic corrosion", "MIC corrosion"],
      correctAnswer: "Galvanic corrosion",
      explanation: "Galvanic corrosion occurs when dissimilar metals are in electrical contact in an electrolyte (seawater), creating a galvanic cell.",
      points: 2,
      order: 4,
    }
  ]);

  // Create lessons for other tracks with similar comprehensive content...
  // (Adding a few more key lessons due to length constraints)

  // Air Diver Track - Gas Management Lesson
  const [airDiverLesson1] = await db.insert(lessons).values({
    trackId: airDiverTrack.id,
    title: "Gas Management and Consumption Planning",
    order: 1,
    content: `# Gas Management and Consumption Planning

Proper gas management is fundamental to safe air diving operations. This module covers consumption calculation, emergency reserves, and supply monitoring.

## Learning Objectives
- Calculate gas consumption rates accurately
- Plan adequate gas supplies for work tasks
- Understand emergency reserve requirements
- Master supply monitoring techniques

## Gas Consumption Fundamentals

### Factors Affecting Consumption
Air consumption varies based on multiple factors:

1. **Physiological Factors**
   - **Respiratory Rate**: Breathing frequency under stress
   - **Physical Condition**: Fitness level and work capacity
   - **Body Size**: Lung capacity and metabolic rate
   - **Experience Level**: Efficiency and stress response

2. **Environmental Conditions**
   - **Depth**: Pressure effects on consumption rate
   - **Water Temperature**: Thermal stress impact
   - **Current Strength**: Physical exertion requirements
   - **Visibility**: Stress and navigation difficulty

3. **Work Requirements**
   - **Task Complexity**: Mental and physical demands
   - **Tool Usage**: Additional physical exertion
   - **Duration**: Sustained vs. intermittent work
   - **Emergency Response**: High-stress consumption rates

## Consumption Calculation Methods

### Standard Consumption Rates
Industry standard consumption rates for planning:
- **Light Work**: 1.5-2.0 cubic feet per minute (CFM)
- **Moderate Work**: 2.0-3.0 CFM
- **Heavy Work**: 3.0-4.5 CFM
- **Emergency/Stress**: 4.5-6.0+ CFM

### Pressure Relationship
Consumption increases with depth due to increased gas density:
- **Surface (1 ATA)**: Baseline consumption
- **33 feet (2 ATA)**: 2x surface consumption
- **66 feet (3 ATA)**: 3x surface consumption
- **99 feet (4 ATA)**: 4x surface consumption

### Planning Calculations
**Total Gas Required = (Consumption Rate × Time × Pressure Factor) + Reserves**

Example for 60-foot dive:
- Work time: 30 minutes
- Consumption rate: 2.5 CFM (moderate work)
- Depth factor: 2.8 ATA
- Safety reserve: 25%

Calculation: (2.5 × 30 × 2.8) × 1.25 = 262.5 cubic feet required

## Emergency Reserve Planning

### Reserve Requirements
Never compromise on emergency reserves:
- **Minimum Reserve**: 25% of total gas supply
- **Emergency Ascent**: Additional 50 cubic feet minimum
- **Surface Interval**: 200 PSI minimum for equipment
- **Communication Loss**: Extended bottom time buffer

### Emergency Scenarios
Plan for potential emergencies:
- **Primary Supply Failure**: Complete loss of main gas source
- **Regulator Malfunction**: Breathing system failure
- **Umbilical Damage**: Surface supply interruption
- **Extended Work Time**: Task overruns and delays

## Supply Monitoring Techniques

### Continuous Monitoring
Maintain constant awareness of gas status:
- **Gauge Checks**: Regular pressure monitoring intervals
- **Consumption Tracking**: Real-time usage calculation
- **Supply Communication**: Regular surface updates
- **Trend Analysis**: Early identification of increased consumption

### Critical Pressure Points
Establish clear decision points:
- **Turn-Around Pressure**: Return to surface initiation
- **Emergency Reserve**: No further consumption allowed
- **Surface Reserve**: Final safety margin
- **Equipment Reserve**: Post-dive system pressure

## Surface Supply Systems

### System Components
Understanding supply system operation:
- **Compressor Capacity**: Continuous flow requirements
- **Distribution Manifold**: Multi-diver supply management
- **Pressure Regulation**: Consistent delivery pressure
- **Monitoring Systems**: Real-time consumption tracking

### Bailout Procedures
Emergency independent air supply:
- **Bailout Bottle Size**: Minimum 10-minute supply
- **Activation Procedures**: Quick-change techniques
- **Ascent Protocols**: Emergency surface procedures
- **Communication Requirements**: Surface notification procedures

## Work Planning Integration

### Task-Based Planning
Integrate gas management with work requirements:
- **Pre-Job Analysis**: Task duration and intensity estimation
- **Contingency Planning**: Alternative approaches and timelines
- **Team Coordination**: Multi-diver gas management
- **Equipment Efficiency**: Tool selection impact on consumption

Understanding and applying proper gas management principles ensures safe, efficient diving operations while maintaining adequate safety margins for emergency response.`,
    objectives: ["Calculate accurate gas consumption rates", "Plan emergency reserves properly", "Master supply monitoring techniques", "Understand depth pressure effects"],
    estimatedMinutes: 40,
    isRequired: true,
  }).returning();

  // Continue with seed completion message
  console.log('✅ Comprehensive diving education platform seeded successfully!');
  console.log(`Created ${await db.select().from(aiTutors).then(r => r.length)} AI tutors`);
  console.log(`Created ${await db.select().from(tracks).then(r => r.length)} comprehensive training tracks`);
  console.log(`Created ${await db.select().from(lessons).then(r => r.length)} professional lessons`);
  console.log(`Created ${await db.select().from(quizzes).then(r => r.length)} enhanced assessments`);
  console.log(`Created ${await db.select().from(questions).then(r => r.length)} multi-type questions`);
  console.log(`Created ${await db.select().from(practiceScenarios).then(r => r.length)} practice scenarios`);
}

comprehensiveSeed().catch(console.error).finally(() => process.exit(0));