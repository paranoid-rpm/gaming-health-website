document.addEventListener('DOMContentLoaded',()=>{
  const navbar=document.getElementById('navbar');
  window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>50));

  /* Reveal animations */
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach((entry,i)=>{
      if(entry.isIntersecting){
        setTimeout(()=>{
          entry.target.style.opacity='1';
          entry.target.style.transform='translateY(0)';
        },i*60);
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.08});

  document.querySelectorAll('.rt-content,.neuro-card,.uni-card').forEach(el=>{
    el.style.opacity='0';
    el.style.transform='translateY(30px)';
    el.style.transition='opacity 0.6s ease,transform 0.6s ease';
    obs.observe(el);
  });

  /* Bar chart animate */
  const barObs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.querySelectorAll('.nc-bar').forEach(bar=>{
          const h=bar.style.height;
          bar.style.height='0';
          setTimeout(()=>{bar.style.height=h;},100);
        });
        barObs.unobserve(entry.target);
      }
    });
  },{threshold:0.3});
  document.querySelectorAll('.neuro-card').forEach(c=>barObs.observe(c));
});
