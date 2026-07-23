(function(){
  const hash=text=>{let h=2166136261;for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(36)};
  const sourceLabel=source=>({revision:'Revision','functional':'Functional Skills',cscs:'CSCS',inhouse:'In-house Training',ta:'Trade Academy',epa:'EPA Knowledge',rpl:'RPL Refresher'}[source]||source||'Learning');
  window.showAnswerReaction=function(correct,container=document.body){
    const reduce=state.accessibility?.reduceMotion;
    container.classList.remove('answer-correct-reaction','answer-wrong-reaction');
    container.classList.add(correct?'answer-correct-reaction':'answer-wrong-reaction');
    if(!reduce){
      const burst=document.createElement('div');burst.className=`answer-reaction-burst ${correct?'correct':'wrong'}`;
      burst.innerHTML=`<strong>${correct?'✓':'×'}</strong><span>${correct?'Correct — well done!':'Not quite'}</span>${correct?'<i>★</i><i>★</i><i>★</i><i>★</i><i>★</i>':''}`;
      document.body.appendChild(burst);setTimeout(()=>burst.remove(),1050);
    }
    if(state.accessibility?.vibration!==false&&navigator.vibrate)navigator.vibrate(correct?70:[55,45,55]);
    setTimeout(()=>container.classList.remove('answer-correct-reaction','answer-wrong-reaction'),1050);
  };
  window.recordKnowledgeGap=function(data){
    if(!data?.question||!data?.correct)return;
    const id=hash(`${data.source}|${data.courseId||'all'}|${data.ksb||''}|${data.question}`);
    const old=state.knowledgeRefresh[id]||{},now=new Date().toISOString();
    state.knowledgeRefresh[id]={...old,id,source:data.source||'learning',category:data.category||sourceLabel(data.source),courseId:data.courseId||'all',ksb:data.ksb||'',question:data.question,correct:data.correct,chosen:data.chosen||'',options:[...new Set((data.options||[]).filter(Boolean))],teaching:data.teaching||`The correct principle is: ${data.correct}`,status:'needs',correctReviews:old.correctReviews||0,attempts:(old.attempts||0)+1,lastWrong:now,updated:now};
  };
  window.recordQuizOutcomes=function(qs,picks,meta={}){
    qs.forEach((q,i)=>{const picked=Number(picks[i]);if(Number.isInteger(picked)&&picked!==q.answer)window.recordKnowledgeGap({source:meta.source,category:meta.category,courseId:meta.courseId||'all',ksb:q.ksb||meta.ksb||'',question:q.q,correct:q.options[q.answer],chosen:q.options[picked],options:q.options,teaching:q.teaching?`${q.teaching} Correct principle: ${q.options[q.answer]}`:meta.teaching?`${meta.teaching} Correct principle: ${q.options[q.answer]}`:`Remember: ${q.options[q.answer]}`})});
    save();
  };
  function availableKnowledgeItems(){
    const cid=course().id;
    return Object.values(state.knowledgeRefresh).filter(x=>x.courseId==='all'||x.courseId===cid).sort((a,b)=>({needs:0,improving:1,secure:2}[a.status]-{needs:0,improving:1,secure:2}[b.status])||String(b.updated).localeCompare(String(a.updated)));
  }
  window.knowledgeRefreshCounts=function(){const items=availableKnowledgeItems();return {needs:items.filter(x=>x.status==='needs').length,improving:items.filter(x=>x.status==='improving').length,secure:items.filter(x=>x.status==='secure').length,total:items.length}};
  function backToLearning(){view.learningActivity=null;view.learningItem=null;view.learningSession=null;render()}
  function reviewOptions(item){
    let options=[item.correct,...item.options.filter(x=>x!==item.correct)].slice(0,4);
    const fallbacks=['Apply the requirement only when it is convenient.','Rely on memory instead of checking the current information.','Continue without verifying the result or recording the decision.'];
    while(options.length<4)options.push(fallbacks.find(x=>!options.includes(x)));
    const shift=(item.attempts||0)%4;return options.slice(shift).concat(options.slice(0,shift));
  }
  function renderKnowledgeOverview(){
    const counts=knowledgeRefreshCounts(),items=availableKnowledgeItems(),recent=items.slice(0,6);
    shell('Knowledge Refresh',`<button class="back" id="backKnowledgeRefresh">‹ Back to Learning</button><div class="refresh-hero"><span>PERSONALISED LEARNING</span><h2>Knowledge Refresh</h2><p>Relearn topics from incorrect answers, then check your understanding with a newly worded prompt. Original assessment results are not changed.</p></div><div class="refresh-stats"><div><b>${counts.needs}</b><span>To strengthen</span></div><div><b>${counts.improving}</b><span>Improving</span></div><div><b>${counts.secure}</b><span>Secure</span></div></div><button class="btn btn-primary" id="startKnowledgeRefresh" ${counts.needs+counts.improving?'':'disabled'}>${counts.needs+counts.improving?'Start a short refresh':'Nothing currently needs refreshing'}</button><div class="refresh-history">${recent.map(x=>`<div class="refresh-history-row status-${x.status}"><span>${x.ksb||'✓'}</span><div><b>${esc(x.category)}</b><small>${esc(x.question)}</small></div><em>${x.status==='needs'?'Needs practice':x.status==='improving'?'Improving':'Secure'}</em></div>`).join('')||'<div class="card empty">Incorrect answers will appear here automatically.</div>'}</div>`);
    $('#backKnowledgeRefresh').onclick=backToLearning;
    $('#startKnowledgeRefresh').onclick=()=>{view.learningSession=items.filter(x=>x.status!=='secure').slice(0,5).map(x=>x.id);view.learningItem=0;render()};
  }
  function renderKnowledgeItem(){
    const ids=view.learningSession||[],item=state.knowledgeRefresh[ids[view.learningItem]];
    if(!item)return renderKnowledgeOverview();
    const options=reviewOptions(item),number=view.learningItem+1;
    shell('Knowledge Refresh',`<button class="back" id="backKnowledgeSession">‹ End refresh</button><div class="course-banner refresh-banner"><span>${esc(sourceLabel(item.source))}${item.ksb?` · ${esc(item.ksb)}`:''}</span><strong>Refresh ${number} of ${ids.length}</strong></div><article class="card refresh-learning-card"><span>LEARN IT AGAIN</span><h2>${esc(item.category)}</h2><p>${esc(item.teaching)}</p><div class="refresh-misunderstanding"><small>Earlier answer</small><b>${esc(item.chosen||'An incorrect option')}</b></div><h3>Which statement now best reflects the correct principle?</h3><div class="refresh-answer-grid">${options.map((o,i)=>`<button data-refresh-answer="${i}">${esc(o)}</button>`).join('')}</div><div class="refresh-result" id="refreshResult">Choose the best answer.</div><button class="btn btn-primary" id="nextKnowledgeItem" hidden>${number===ids.length?'Finish refresh':'Next topic'}</button></article>`);
    $('#backKnowledgeSession').onclick=backToLearning;
    $$('[data-refresh-answer]').forEach(b=>b.onclick=()=>{if(b.closest('.refresh-answer-grid').classList.contains('answered'))return;const chosen=options[Number(b.dataset.refreshAnswer)],correct=chosen===item.correct;$('.refresh-answer-grid').classList.add('answered');$$('[data-refresh-answer]').forEach(x=>{x.disabled=true;if(options[Number(x.dataset.refreshAnswer)]===item.correct)x.classList.add('correct');else if(x===b)x.classList.add('incorrect')});item.reviewAttempts=(item.reviewAttempts||0)+1;item.updated=new Date().toISOString();if(correct){item.correctReviews=(item.correctReviews||0)+1;item.status=item.correctReviews>=2?'secure':'improving';$('#refreshResult').innerHTML=`<b>Correct.</b> ${item.status==='secure'?'This topic is now Secure.':'Answer it correctly once more in a later refresh to make it Secure.'}`}else{item.status='needs';item.chosen=chosen;item.lastWrong=item.updated;$('#refreshResult').innerHTML=`<b>Not quite.</b> The correct principle is: ${esc(item.correct)}`};save();showAnswerReaction(correct,$('.refresh-learning-card'));$('#nextKnowledgeItem').hidden=false});
    $('#nextKnowledgeItem').onclick=()=>{if(number>=ids.length){view.learningItem=null;view.learningSession=null;render()}else{view.learningItem++;render()}};
  }
  window.renderKnowledgeRefresh=function(){if(view.learningItem==null)return renderKnowledgeOverview();renderKnowledgeItem()};

  function rplRows(c=course()){return ksbMatrix(c).filter(row=>rplKsbComplete(c,row.code))}
  window.rplRefreshCounts=function(c=course()){const rows=rplRows(c),records=state.rplRefresh[c.id]||{};return {total:rows.length,refreshed:rows.filter(x=>records[x.code]?.correct).length,remaining:rows.filter(x=>!records[x.code]?.correct).length}};
  function rplQuestion(row,rows,c){
    const bank=assignmentQuestionBank(c),exact=bank.filter(q=>q.ksb===row.code),mapped=bank.filter(q=>c.assignments.find(a=>a.number===q.assignmentNumber)?.ksbs?.some(k=>ksbCode(k)===row.code)),pool=exact.length?exact:mapped.length?mapped:bank;
    const source=pool[(Number(row.code.slice(1))||0)%pool.length];
    return {q:source.q,options:[...source.options],answer:source.answer,correct:source.options[source.answer],assignmentTitle:source.assignmentTitle};
  }
  function renderRplOverview(){
    const c=course(),counts=rplRefreshCounts(c),rows=rplRows(c),records=state.rplRefresh[c.id]||{};
    shell('RPL Refresher',`<button class="back" id="backRplRefresh">‹ Back to Learning</button><div class="refresh-hero rpl-hero"><span>RECOGNISED PRIOR LEARNING</span><h2>RPL Refresher</h2><p>A short, ungraded understanding check for KSBs recognised from previous learning. It does not add a pass or fail.</p></div><div class="refresh-stats two"><div><b>${counts.remaining}</b><span>Need refreshing</span></div><div><b>${counts.refreshed}</b><span>Refreshed</span></div></div><button class="btn btn-primary" id="startRplRefresh" ${counts.remaining?'':'disabled'}>${counts.total?counts.remaining?'Refresh recognised topics':'All recognised topics refreshed':'No RPL topics recorded'}</button><div class="rpl-topic-list">${rows.map(row=>`<div class="${records[row.code]?.correct?'refreshed':''}"><b>${records[row.code]?.correct?'✓ ':''}${row.code}</b><span>${esc(row.description)}</span><em>${records[row.code]?.correct?'Refreshed':'To review'}</em></div>`).join('')}</div>`);
    $('#backRplRefresh').onclick=backToLearning;
    $('#startRplRefresh').onclick=()=>{view.learningSession=rows.filter(x=>!records[x.code]?.correct).map(x=>x.code);view.learningItem=0;render()};
  }
  function renderRplItem(){
    const c=course(),rows=rplRows(c),codes=view.learningSession||[],row=rows.find(x=>x.code===codes[view.learningItem]);if(!row)return renderRplOverview();
    const q=rplQuestion(row,ksbMatrix(c),c),number=view.learningItem+1;
    shell('RPL Refresher',`<button class="back" id="backRplSession">‹ End refresher</button><div class="course-banner refresh-banner"><span>${esc(c.name)}</span><strong>Topic ${number} of ${codes.length}</strong></div><article class="card refresh-learning-card"><span>RPL TOPIC · ${esc(row.code)}</span><h2>${esc(q.assignmentTitle||row.code)}</h2><p>${esc(row.description)}</p><h3>${esc(q.q)}</h3><div class="refresh-answer-grid">${q.options.map((o,i)=>`<button data-rpl-answer="${i}">${esc(o)}</button>`).join('')}</div><div class="refresh-result" id="rplRefreshResult">Choose the best answer. There is no pass or fail.</div><button class="btn btn-primary" id="nextRplItem" hidden>${number===codes.length?'Finish refresher':'Next topic'}</button></article>`);
    $('#backRplSession').onclick=backToLearning;
    $$('[data-rpl-answer]').forEach(b=>b.onclick=()=>{if(b.closest('.refresh-answer-grid').classList.contains('answered'))return;const picked=Number(b.dataset.rplAnswer),correct=picked===q.answer;$('.refresh-answer-grid').classList.add('answered');$$('[data-rpl-answer]').forEach(x=>{x.disabled=true;if(Number(x.dataset.rplAnswer)===q.answer)x.classList.add('correct');else if(x===b)x.classList.add('incorrect')});state.rplRefresh[c.id]=state.rplRefresh[c.id]||{};state.rplRefresh[c.id][row.code]={correct,date:new Date().toISOString(),attempts:(state.rplRefresh[c.id][row.code]?.attempts||0)+1};if(!correct)recordKnowledgeGap({source:'rpl',category:`RPL · ${row.code}`,courseId:c.id,ksb:row.code,question:q.q,correct:q.correct,chosen:q.options[picked],options:q.options,teaching:`${row.code}: ${row.description}`});save();showAnswerReaction(correct,$('.refresh-learning-card'));$('#rplRefreshResult').innerHTML=correct?'<b>Understood.</b> This recognised topic has been refreshed.':`<b>Refresh recommended.</b> This topic has been added to Knowledge Refresh. The correct principle is: ${esc(q.correct)}`;$('#nextRplItem').hidden=false});
    $('#nextRplItem').onclick=()=>{if(number>=codes.length){view.learningItem=null;view.learningSession=null;render()}else{view.learningItem++;render()}};
  }
  window.renderRplRefresh=function(){if(view.learningItem==null)return renderRplOverview();renderRplItem()};
})();
