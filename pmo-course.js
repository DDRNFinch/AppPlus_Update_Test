(function(){
  const K={
    K1:'The principles and requirements of planned preventative maintenance (PPM) and reactive maintenance.',
    K2:'The range of building types and characteristic uses, their common methods of construction and typical defects, and the impact that property maintenance operations may have on building safety.',
    K3:'Health and safety regulations, relevance to the occupation and the operative’s responsibilities. Health and Safety at Work Act, COSHH, manual handling, PPE, working at height, guards, signage and fire extinguishers.',
    K4:'Risks and hazards associated with property maintenance activities, and their mitigation using risk assessment.',
    K5:'Key regulatory and legislative requirements, including building regulations, the Building Safety Act and BSI Flex 8670, and their impact on property maintenance responsibilities.',
    K6:'The importance of establishing a safe and tidy work area, using appropriate access equipment, protecting adjacent areas and considering other property users.',
    K7:'Common hand and power tools and equipment used in routine property maintenance tasks and how to use them safely.',
    K8:'Common components of electrical and electronic systems, safe isolation of electrical supplies and procedures for correctly reporting identified faults.',
    K9:'Common forms of emergency equipment and signage, their importance within buildings and the preventative or corrective maintenance required.',
    K10:'Principles and components of plumbing systems and how to safely isolate, store and drain down water supplies to diagnose faults and clear blockages.',
    K11:'Principles and components of above- and below-ground drainage systems, the effects of poor drainage and how to diagnose faults and clear blockages.',
    K12:'Principles of good water hygiene, checks and legal certification used to minimise water hygiene and legionella risks.',
    K13:'Principles and components of common environmental and energy management systems and their methods of operation.',
    K14:'Common defects in windows, doors and glazing systems; the characteristics, uses and limitations of their materials and components; and how these meet statutory regulations.',
    K15:'Common materials and processes used to prepare, repair and finish plaster defects.',
    K16:'Common causes of painting and decorating defects; materials, chemicals and processes used; and safe storage and disposal.',
    K17:'Common causes of tiling defects and the materials and processes used in tiling activities.',
    K18:'Common causes of flooring defects and the materials and processes used in flooring repairs.',
    K19:'Common masonry and damp-proofing defects and the materials and processes used for mortar mixing, repointing, masonry bonding, coping and damp-proofing repairs.',
    K20:'Common roof structures and defects and the materials and processes used in remedial and temporary roof repairs.',
    K21:'Common fencing and railing systems, their typical defects and the materials and processes used in repairs.',
    K22:'Common groundwork and landscaping systems, their typical defects and the materials and processes used in remedial repair.',
    K23:'Technical sources of information and data used in property maintenance operations.',
    K24:'Methods used to record written and digital information and data, and the importance of data protection and security.',
    K25:'The purpose of quality assurance and continuous improvement and how these address commonly occurring faults or inefficiencies.',
    K26:'Environmental regulations and requirements, including the Environmental Protection Act, safe waste disposal, reuse, recycling, permitted contractors, energy efficiency and net-zero outcomes.',
    K27:'Communication methods and when to use industry terminology and adapt style to the audience.',
    K28:'The importance of customer service and providing feedback that keeps customers informed about property maintenance.',
    K29:'The roles and responsibilities of property maintenance operatives and the purpose and interdependencies of other trade operatives.',
    K30:'Employee and employer rights and responsibilities and awareness of equality, diversity and inclusion, safeguarding and Prevent.',
    K31:'The purpose of continuing professional development and how it supports awareness of personal authority and competence limits.'
  };
  const S={
    S1:'Plan the sequence of work required to carry out routine property maintenance operations.',
    S2:'Identify and select appropriate compliant materials and components in line with regulations and manufacturer specifications.',
    S3:'Comply with statutory health and safety regulations and requirements.',
    S4:'Comply with risk assessments and organise the workplace to safeguard themselves and the property.',
    S5:'Comply with key regulatory and legislative requirements, including building regulations.',
    S6:'Use safe working practices including PPE, signage, barriers, access equipment and preparation and reinstatement of the work area.',
    S7:'Select and use tools and equipment with safeguards in place and ensure correct functioning.',
    S8:'Safely isolate and secure electrical or electronic supplies before property maintenance operations.',
    S9:'Apply routine emergency-system checks, testing and maintenance and identify and report faults.',
    S10:'Maintain and repair plumbing systems, including fault diagnosis, safe isolation, component replacement and blockage clearance.',
    S11:'Maintain and repair external drainage systems, including clearing blockages and replacing components.',
    S12:'Maintain and repair environmental and energy-management systems, including fault diagnosis, safe isolation and component replacement.',
    S13:'Use carpentry and joinery skills to repair windows, doors, glazing units and associated fittings.',
    S14:'Repair plastered surfaces, including preparation, fixing and mixing materials and compounds.',
    S15:'Use painting and decorating skills to prepare surfaces, apply paint by brush and roller and complete sealing with gun applicators.',
    S16:'Repair tiling, including setting out, preparing surfaces and cutting around obstacles.',
    S17:'Repair flooring, including setting out, preparing surfaces and cutting around obstacles.',
    S18:'Perform planned, responsive or temporary repairs to minor masonry, roofing, fencing, railing, groundwork or landscaping defects.',
    S19:'Select and use technical literature and other information sources to address property maintenance problems.',
    S20:'Record and report information using digital and written techniques.',
    S21:'Inspect own work and ensure it meets the given specifications.',
    S22:'Comply with environmental procedures and segregate resources for reuse, recycling and disposal.',
    S23:'Adapt communication for different situations and work with colleagues and stakeholders using appropriate industry terminology.',
    S24:'Provide customer feedback while maintaining customer service.',
    S25:'Escalate issues beyond personal competence and authority.'
  };
  const B={
    B1:'Prioritise and promote sustainable working practices.',
    B2:'Prioritise and promote health and safety.',
    B3:'Take responsibility for completion of own work.',
    B4:'Maintain a team focus to meet goals.',
    B5:'Contribute to an equal, diverse and inclusive culture.',
    B6:'Seek learning and development opportunities.'
  };
  const keywords={
    K1:'planned maintenance',K2:'building defects',K3:'safety regulations',K4:'risk assessment',K5:'building regulations',K6:'safe work area',K7:'tool safety',K8:'electrical systems',K9:'emergency systems',K10:'plumbing systems',K11:'drainage systems',K12:'water hygiene',K13:'energy systems',K14:'windows and doors',K15:'plaster defects',K16:'decorating defects',K17:'tiling defects',K18:'flooring defects',K19:'masonry defects',K20:'roof defects',K21:'fencing systems',K22:'groundwork systems',K23:'technical information',K24:'data security',K25:'quality improvement',K26:'environmental protection',K27:'adapted communication',K28:'customer service',K29:'trade coordination',K30:'equality and safeguarding',K31:'professional development',
    S1:'work sequence',S2:'compliant materials',S3:'safety compliance',S4:'workplace controls',S5:'regulatory compliance',S6:'safe working',S7:'equipment safeguards',S8:'safe isolation',S9:'system checks',S10:'plumbing repair',S11:'drainage repair',S12:'energy maintenance',S13:'joinery repair',S14:'plaster repair',S15:'decoration work',S16:'tiling repair',S17:'flooring repair',S18:'building repair',S19:'information use',S20:'record and report',S21:'quality inspection',S22:'waste segregation',S23:'workplace communication',S24:'customer feedback',S25:'escalate issues',
    B1:'sustainable practice',B2:'safety priority',B3:'own work responsibility',B4:'team goals',B5:'inclusive culture',B6:'learning opportunities'
  };
  const maps=[
    [1,'Safe Maintenance Operations',['S3','S4'],['K3','K4','K6'],'B2','Prepare and control a live maintenance work area, complete a task-specific risk assessment, establish safe access and protection, and demonstrate statutory compliance before and during a routine repair.',['Legislation, RAMS and task controls','Work-area organisation and protection','PPE, signage, barriers and access','Hazard identification and control','Protection of occupants and property','Safe sequence and supervision checks','Emergency arrangements','Reinstatement of the area']],
    [2,'Maintenance Planning & Technical Information',['S1','S19'],['K1','K5','K23'],'B3','Survey a reported property defect, decide whether planned or reactive maintenance is required, use technical information and produce a compliant sequence of work.',['Defect survey and diagnosis','Planned or reactive classification','Information-source selection','Legislative and specification checks','Sequencing and dependencies','Resources and access planning','Contingencies and escalation points','Clear work plan and handover']],
    [3,'Materials, Tools & Quality Improvement',['S2','S7'],['K7','K25','K31'],'B6','Select compliant materials, components, hand tools and power tools for a multi-material maintenance repair, inspect them before use and complete a first-off quality check.',['Material and component compliance','Manufacturer-information checks','Tool suitability and condition','Guards and safeguards','Controlled use and adjustment','Quality criteria and first-off check','Defect prevention and improvement','Tool care and storage']],
    [4,'Electrical Isolation & Emergency Systems',['S8','S9'],['K8','K9','K3'],'B2','On an approved training rig, demonstrate safe electrical isolation and complete routine checks of emergency equipment and signage, recording and escalating all introduced faults.',['Authorisation and limits of competence','Safe isolation procedure','Proving and securing isolation','Electrical component awareness','Emergency-equipment inspection','Signage and access checks','Fault identification and reporting','Safe reinstatement or continued isolation']],
    [5,'Plumbing Repairs & Water Hygiene',['S10','S20'],['K10','K12','K24'],'B3','Diagnose and repair a plumbing fault on a training installation, safely isolate and drain the supply, replace a component, restore service and produce a secure maintenance record.',['Fault diagnosis','Water isolation and drain-down','Component selection and replacement','Blockage or leakage control','Water-hygiene precautions','Testing after reinstatement','Digital or written record quality','Data protection and reporting']],
    [6,'Drainage Repairs & Quality Checks',['S11','S21'],['K11','K22','K25'],'B3','Diagnose a defective external drainage training installation, clear a blockage or replace a minor component, then inspect flow, alignment, falls and finished quality.',['Safe access and contamination controls','Drainage-system diagnosis','Blockage-clearance method','Component replacement','Falls and alignment','Flow and leakage testing','Specification and quality inspection','Defect prevention and site reinstatement']],
    [7,'Environmental & Energy Systems',['S12','S22'],['K13','K26','K5'],'B1','Diagnose and complete an authorised minor repair or component replacement on an environmental or energy-management training system, then segregate waste and verify efficient operation.',['System identification and operation','Isolation and stored-energy controls','Fault diagnosis','Component replacement','Regulatory compliance','Energy-efficiency check','Waste segregation and disposal','Safe testing and handover']],
    [8,'Windows, Doors & Glazing Repairs',['S13','S6'],['K14','K6','K7'],'B2','Repair and adjust a defective timber door or window training assembly, replace an associated fitting or glazing component and leave the area safe, secure and operational.',['Safe work area and occupant protection','Defect diagnosis','Tool and material selection','Frame, sash or door adjustment','Fitting or glazing-component replacement','Clearances, alignment and operation','Security, weathering and regulatory checks','Finish, protection and reinstatement']],
    [9,'Plaster Surface Repairs',['S14','S21'],['K15','K2','K25'],'B3','Prepare and repair a damaged plastered surface using compatible materials and compounds, blend the repair and inspect it against the supplied finish and tolerance requirements.',['Building and substrate identification','Defect cause and extent','Surface preparation','Material compatibility and mixing','Application and build-up','Flatness, edges and blending','Drying and finish checks','Quality inspection and improvement']],
    [10,'Painting, Decorating & Sealing',['S15','S22'],['K16','K26','K7'],'B1','Prepare and decorate a previously repaired surface using brush and roller techniques, complete a controlled sealant application and manage chemicals and waste safely.',['Defect diagnosis and preparation','Paint and chemical selection','COSHH, storage and spill controls','Brush application','Roller application','Sealant-gun control and finish','Coverage, opacity and defect checks','Cleaning, waste segregation and disposal']],
    [11,'Tiling Repairs',['S16','S2'],['K17','K23','K5'],'B4','Remove and replace damaged wall or floor tiles around an obstacle, using technical information to select compatible materials and restore line, level, spacing and finish.',['Task coordination and safe removal','Technical information and specification','Substrate assessment and preparation','Setting out and joint alignment','Material and adhesive compatibility','Accurate cutting around obstacles','Fixing, spacing and grouting','Clean finish and team handover']],
    [12,'Flooring Repairs',['S17','S1'],['K18','K2','K23'],'B3','Plan and complete a localised flooring repair around an obstacle, preparing the substrate, cutting and fitting replacement material and checking the completed surface.',['Building use and flooring defect','Work sequence and access','Technical and manufacturer information','Subfloor preparation','Setting out and pattern alignment','Cutting around obstacles','Fixing and joint quality','Finished level, safety and inspection']],
    [13,'Masonry, Damp & Roofing Repairs',['S18','S5'],['K19','K20','K5'],'B2','Diagnose two introduced external-building defects and complete one authorised masonry or damp-proofing repair plus one safe temporary roof repair to the supplied specification.',['Defect diagnosis and repair limits','Building-regulation requirements','Mortar, masonry or DPC preparation','Bond, pointing or coping repair','Roof type and temporary repair selection','Weatherproofing and stability','Safe access and work-at-height controls','Inspection, recording and escalation']],
    [14,'Fencing, Groundworks & Escalation',['S18','S25'],['K21','K22','K29'],'B1','Inspect an external area, repair a minor fencing, railing, groundwork or landscaping defect and correctly escalate a second defect that requires another trade or exceeds personal authority.',['External-area risk controls','Fencing or groundwork diagnosis','Material and repair selection','Line, level, support and fixing','Drainage and surrounding-ground protection','Sustainable material use','Competence-limit decision','Clear escalation and trade coordination']],
    [15,'Communication, Customer Service & Inclusion',['S23','S24'],['K27','K28','K30'],'B5','Complete a simulated occupied-property maintenance handover: explain the work to a customer, adapt communication, provide accurate feedback, respond inclusively and record agreed next steps.',['Audience and communication method','Accurate industry terminology','Customer needs and expectations','Clear progress and completion feedback','Respectful and inclusive communication','Safeguarding and Prevent awareness','Complaint or concern handling','Agreed actions and professional close']]
  ];
  const value=code=>({K,S,B}[code[0]][code]);
  const statementPrompt=code=>({keyword:keywords[code],detail:value(code),ksb:code});
  const assignments=maps.map(([number,title,skills,knowledge,behaviour,practicalTask,practicalCriteria])=>{
    const behaviours=behaviour?[`${behaviour}: ${B[behaviour]}`]:[];
    const skillRows=skills.map(code=>`${code}: ${S[code]}`),knowledgeRows=knowledge.map(code=>`${code}: ${K[code]}`);
    return {
      number,title,skills:skillRows,knowledge:knowledgeRows,behaviours,
      ksbs:[...skillRows,...knowledgeRows,...behaviours],
      photoPrompts:[
        `Show the work area, task information and initial condition before demonstrating ${skills[0]}: ${S[skills[0]]}`,
        `Show the materials, components, tools and controls selected while demonstrating ${skills[1]}: ${S[skills[1]]}`,
        `Show the safe preparation and first stage of work while demonstrating ${skills[0]}: ${S[skills[0]]}`,
        `Show the main practical technique being completed while demonstrating ${skills[1]}: ${S[skills[1]]}`,
        `Show measurements, testing or quality checks while demonstrating ${skills[0]}: ${S[skills[0]]}`,
        `Show the completed result, reinstated area and final evidence of ${skills[1]}: ${S[skills[1]]}`
      ],
      statementPrompts:[...skills,...knowledge,...(behaviour?[behaviour]:[])].map(statementPrompt),
      practicalTask,practicalCriteria
    };
  });
  window.APP_COURSES.push({
    id:'pmo',
    name:'Property Maintenance Operative',
    reference:'ST0171',
    version:'1.1',
    level:'2',
    assignments
  });
})();
