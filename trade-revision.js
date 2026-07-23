(function(){
  const functional=window.REVISION_PACKS||{};
  const themes=[
    ['Purpose and standards','underpinning purpose, recognised standards and the result that competent work must achieve'],
    ['Planning and information','drawings, specifications, instructions, sequencing and the checks needed before work begins'],
    ['Hazards and controls','task-specific hazards, RAMS, PPE or RPE, access, dust controls and protection of other people'],
    ['Tools and equipment','selection, inspection, adjustment and controlled use of the tools or equipment required'],
    ['Materials and preparation','material suitability, defects, storage, conditioning, preparation and efficient use'],
    ['Setting out and accuracy','datum points, measurements, calculations, tolerances and independent dimensional checks'],
    ['Trade technique','the correct practical sequence, workmanship principles and reasons for each important operation'],
    ['Quality and defects','quality criteria, common defects, likely causes, prevention and proportionate corrective action'],
    ['Communication and decisions','clear reporting, coordination, changes, limits of authority and evidence-based decisions'],
    ['Completion and evidence','final inspection, safe handover, records, sustainability, reflection and evidence of competence']
  ];
  const tradeDetails={
    brick:{name:'bricklaying',work:'masonry, mortar, walling and associated components',checks:'gauge, line, level, plumb, square, bond, joint finish and dimensional tolerance'},
    site:{name:'site carpentry',work:'timber components, structural fixings, first-fix and second-fix installation',checks:'datum, line, level, plumb, square, fit, fixing, tolerance and finish'},
    bench:{name:'architectural joinery',work:'timber selection, setting-out rods, machining, joints, assembly and finishing',checks:'size, square, twist, joint fit, profile continuity, surface quality and tolerance'},
    pmo:{name:'property maintenance',work:'planned and responsive diagnosis, safe isolation, multi-trade repair, occupant protection, records and customer handover',checks:'safe isolation, specification, compatibility, dimensions, operation, leakage, security, finish, reinstatement and accurate reporting'}
  };
  const strip=s=>String(s||'').replace(/^[KSB]\d+\s*:\s*/i,'').replace(/\s+/g,' ').trim();
  const code=s=>(String(s||'').match(/^[KSB]\d+/i)||['KSB'])[0].toUpperCase();
  const shortened=(s,n=230)=>{s=strip(s);return s.length>n?s.slice(0,n).replace(/\s+\S*$/,'')+'…':s};
  const checks=[
    {
      question:(a,trade)=>`Before starting ${a.title.toLowerCase()}, what must the apprentice establish first?`,
      correct:'The specified outcome, applicable standard and evidence that will show the work is acceptable.',
      wrong:['The quickest method used on the previous job.','The finish that uses the fewest materials, regardless of the specification.','Only the time available before the work must be handed over.']
    },{
      question:a=>`The drawing and written instruction for ${a.title.toLowerCase()} conflict. What should happen next?`,
      correct:'Pause the work, check the current authorised information and record the agreed instruction.',
      wrong:['Follow whichever document gives the easier method.','Continue from memory and explain the difference at handover.','Ask another apprentice to decide without recording the change.']
    },{
      question:a=>`A new hazard appears while completing ${a.title.toLowerCase()}. What is the correct response?`,
      correct:'Stop, protect people and the work area, then reassess the risk and required controls before continuing.',
      wrong:['Finish the current stage before mentioning it.','Rely on PPE alone because the original assessment is already signed.','Move the hazard out of view and continue using the original method.']
    },{
      question:(a,trade)=>`Which tool and equipment check is required before the practical work for ${a.title.toLowerCase()}?`,
      correct:'Confirm suitability, condition, guards or safeguards and correct operation before use.',
      wrong:['Use any available tool if it can physically complete the task.','Test the tool on the finished work so no preparation time is lost.','Assume equipment is safe when another worker used it earlier.']
    },{
      question:a=>`How should materials or components for ${a.title.toLowerCase()} be selected?`,
      correct:'Check the specification, compatibility, condition and manufacturer requirements before preparation or installation.',
      wrong:['Choose the cheapest available item without checking compatibility.','Use damaged stock first to reduce waste.','Substitute any similar-looking product without approval.']
    },{
      question:(a,trade)=>`What provides the strongest accuracy control during ${a.title.toLowerCase()}?`,
      correct:'Work from a confirmed datum, measure systematically and independently re-check before the work becomes concealed.',
      wrong:['Estimate dimensions visually and check only at completion.','Copy an existing feature without confirming that it is correct.','Adjust the datum whenever a measurement is inconvenient.']
    },{
      question:(a,trade)=>`Which approach best demonstrates correct ${trade.name} technique during ${a.title.toLowerCase()}?`,
      correct:'Follow the planned sequence and specification, checking workmanship at each important stage.',
      wrong:['Complete every stage first and inspect only the visible finish.','Change the sequence whenever it feels faster without considering later work.','Prioritise appearance even when it conflicts with safety or performance.']
    },{
      question:a=>`A defect is found during ${a.title.toLowerCase()}. What should the apprentice do?`,
      correct:'Identify the likely cause, correct it within their authority and re-check against the required quality criteria.',
      wrong:['Cover the defect if it will not be visible at handover.','Repair only its appearance without investigating the cause.','Leave it for the next trade without recording or reporting it.']
    },{
      question:a=>`An authorised change is agreed during ${a.title.toLowerCase()}. How should it be communicated?`,
      correct:'Record the facts, the authorised decision and its effect, then share it with the relevant people.',
      wrong:['Mention it informally to one colleague and continue.','Keep it off the record because the change was verbally approved.','Describe personal opinions but omit measurements and evidence.']
    },{
      question:a=>`Which action correctly completes ${a.title.toLowerCase()}?`,
      correct:'Inspect and test the result, reinstate the area, record evidence and give a clear handover including any limitations.',
      wrong:['Leave once the visible task is finished.','Discard records after taking one final photograph.','Handover without testing because the work followed the planned sequence.']
    }
  ];
  function assignmentPack(c,a){
    const trade=tradeDetails[c.id]||{name:c.name.toLowerCase(),work:'course-specific work',checks:'accuracy, quality, safety and finish'};
    const ksbs=(a.ksbs||[]).filter(Boolean),skills=(a.skills||ksbs.filter(x=>/^S\d+/i.test(x))),knowledge=(a.knowledge||ksbs.filter(x=>/^K\d+/i.test(x))),behaviours=(a.behaviours||ksbs.filter(x=>/^B\d+/i.test(x)));
    const pool=ksbs.length?ksbs:[`${a.title}: complete the work safely, accurately and to the specified quality`];
    const sourceQuestions=assignmentQuestionsFor(c,a);
    const topics=themes.map(([title,focus],i)=>{
      const primary=pool[i%pool.length],secondary=pool[(i+1)%pool.length],skill=skills[i%Math.max(1,skills.length)]||primary,know=knowledge[i%Math.max(1,knowledge.length)]||secondary,behaviour=behaviours[i%Math.max(1,behaviours.length)]||'Take responsibility, communicate professionally and seek guidance when required.';
      const source=sourceQuestions[i%sourceQuestions.length],correct=source.options[source.answer];
      const label=`${title}: ${code(primary)}`;
      const learn=`For ${a.title}, this topic covers ${focus}. The assignment question tests this principle: ${correct} Apply it to ${trade.work} using the current specification, manufacturer guidance and safe system of work.`;
      const method=`Confirm the result, information, sequence, resources, controls and inspection points. Apply ${shortened(know,90)} Demonstrate ${shortened(skill,90)} Check each stage against the drawing or specification, including ${trade.checks}. Pause for an authorised decision if information conflicts or the task exceeds your authority.`;
      const example=`During ${a.title.toLowerCase()}, a condition, material, measurement or instruction differs from the plan. Protect the area, verify the difference, consider safety and performance, then report the facts. Record the authorised response before continuing and re-check the affected stage. Evidence should show key stages, measurements, decisions and the final result. This supports ${shortened(behaviour,80)}`;
      return {title:label,learn,method,example,q:source.q,options:[...source.options],answer:source.answer,ksb:source.ksb};
    });
    return {title:`AS${a.number}: ${a.title}`,subject:`${c.name.toUpperCase()} · ASSIGNMENT ${a.number}`,courseId:c.id,assignment:a.number,topics};
  }
  function selectedPack(id){
    if(functional[id])return functional[id];
    const match=String(id||'').match(/^trade:([^:]+):(\d+)$/);if(!match)return null;
    const c=APP_COURSES.find(x=>x.id===match[1]),a=c?.assignments.find(x=>x.number===Number(match[2]));
    return c&&a?assignmentPack(c,a):null;
  }
  function openPack(id){
    const key=`revision:${id}`,start=()=>{view.revisionPack=id;view.revisionSlide=0;view.revisionAnswers={};render()},resume=p=>{view.revisionPack=id;view.revisionSlide=Number(p.current)||0;view.revisionAnswers=p.answers||{};render()};
    if(state.quizProgress[key])offerQuizResume(key,resume,start);else start();
  }
  window.renderRevisionOverview=function(){
    const c=course();
    const packStatus=id=>state.revisionProgress[id]?.completed?'Completed':state.quizProgress[`revision:${id}`]?'In progress':'Not started';
    shell('Revision Packs',`<button class="back" id="backRevisionFolders">‹ Back to Academy</button><div class="revision-hero"><span>APPRENTICE+ REVISION LIBRARY</span><h2>Revision Packs</h2><p>Guided Functional Skills and assignment-by-assignment trade revision. Every pack uses 30 teaching slides and 10 knowledge checks.</p></div><div class="revision-library-label"><b>${esc(c.name.toUpperCase())} ASSIGNMENT PACKS</b><span>${c.assignments.length} packs</span></div><div class="revision-pack-grid trade-revision-grid">${c.assignments.map(a=>`<button class="revision-pack-card trade-pack-card" data-revision-pack="trade:${c.id}:${a.number}"><span>TRADE REVISION · AS${a.number}</span><h3>${esc(a.title)}</h3><p>30 detailed slides · 10 questions · ${a.ksbs.length} KSBs</p><b>Open pack ›</b></button>`).join('')}</div><div class="revision-library-label"><b>FUNCTIONAL SKILLS</b><span>4 packs</span></div><div class="revision-pack-grid">${Object.entries(functional).map(([id,p])=>`<button class="revision-pack-card" data-revision-pack="${id}"><span>FUNCTIONAL SKILLS</span><h3>${esc(p.title)}</h3><p>30 teaching slides · 10 questions</p><b>Open pack ›</b></button>`).join('')}</div>`);
    $('#backRevisionFolders').onclick=()=>{view.academySection=null;render()};
    $$('[data-revision-pack]').forEach(b=>b.onclick=()=>openPack(b.dataset.revisionPack));
    $$('[data-revision-pack]').forEach(b=>{const id=b.dataset.revisionPack,p=b.querySelector('p');if(p)p.insertAdjacentHTML('afterend',`<em class="activity-status">${packStatus(id)}</em>`)});
  };
  window.renderRevisionPack=function(){
    const p=selectedPack(view.revisionPack);if(!p){view.revisionPack=null;return renderAcademy()}
    const progressKey=`revision:${view.revisionPack}`,index=Math.max(0,Math.min(39,Number(view.revisionSlide)||0)),topic=Math.floor(index/4),part=index%4,x=p.topics[topic],isQ=part===3,answer=view.revisionAnswers?.[topic];
    const teaching=part===0?['Understand the requirement',x.learn]:part===1?['Apply the method',x.method]:['Trade-specific applied example',x.example];
    const persist=()=>{state.quizProgress[progressKey]={current:Number(view.revisionSlide)||0,answers:{...(view.revisionAnswers||{})},updated:new Date().toISOString()};save()};
    const options=isQ?x.options.map((o,n)=>{const cls=answer==null?'':n===x.answer?'correct':n===answer?'incorrect':'';return `<label class="${cls}"><input type="radio" name="revisionAnswer" value="${n}" ${answer===n?'checked':''} ${answer!=null?'disabled':''}><b>${esc(o)}</b></label>`}).join(''):'';
    shell('Revision Pack',`<button class="back" id="backRevisionPack">‹ Back to Revision Packs</button><div class="course-banner revision-banner"><span>${esc(p.subject)}</span><strong>Topic ${topic+1} of 10 · ${isQ?'Question '+(topic+1):'Teaching slide '+(topic*3+part+1)+' of 30'}</strong></div><article class="card revision-slide ${isQ?'revision-question':''}"><span>${isQ?'KNOWLEDGE CHECK':`TEACHING SLIDE ${part+1} OF 3`}</span><h2>${esc(x.title)}</h2>${isQ?`<h3>${esc(x.q)}</h3><div class="revision-options">${options}</div><div class="revision-feedback">${answer==null?'Choose an answer, then confirm.':answer===x.answer?'Correct. Continue to the next topic.':`Review the teaching slides. The best response is: ${esc(x.options[x.answer])}`}</div>`:`<h3>${esc(teaching[0])}</h3><p>${esc(teaching[1])}</p>`}<div class="training-progress"><span style="width:${(index+1)/40*100}%"></span></div><div class="training-controls"><button class="btn btn-secondary" id="revisionPrevious" ${index===0?'disabled':''}>‹ Previous</button><button class="btn btn-primary" id="revisionNext">${isQ&&answer==null?'Confirm answer':index===39?'Finish pack':'Next ›'}</button></div></article>`);
    $('#backRevisionPack').onclick=()=>{persist();view.revisionPack=null;view.academySection='revision';render()};
    $('#revisionPrevious').onclick=()=>{view.revisionSlide=Math.max(0,index-1);persist();render()};
    $('#revisionNext').onclick=()=>{if(isQ&&answer==null){const selected=$('input[name="revisionAnswer"]:checked');if(!selected)return toast('Choose an answer first');const picked=Number(selected.value),correct=picked===x.answer,card=$('.revision-slide');selected.closest('label')?.classList.add(correct?'correct':'incorrect');if(!correct){const correctInput=$(`input[name="revisionAnswer"][value="${x.answer}"]`);correctInput?.closest('label')?.classList.add('correct');recordKnowledgeGap({source:'revision',category:p.title,courseId:p.courseId||'all',ksb:(x.title.match(/[KSB]\d+/)||[''])[0],question:x.q,correct:x.options[x.answer],chosen:x.options[picked],options:x.options,teaching:`${x.learn} ${x.method} ${x.example}`});save()}showAnswerReaction(correct,card);setTimeout(()=>{view.revisionAnswers=view.revisionAnswers||{};view.revisionAnswers[topic]=picked;persist();render()},700);return}if(index===39){state.revisionProgress[view.revisionPack]={completed:true,date:new Date().toISOString()};delete state.quizProgress[progressKey];save();view.revisionPack=null;view.academySection='revision';toast('Revision pack completed');render()}else{view.revisionSlide=index+1;persist();render()}};
  };
})();
