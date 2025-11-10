(function(){
  const PRICES_VERSION='2025-11-05';
  const pdfUrl=id=>`pdfs/${id}.pdf?v=${encodeURIComponent(PRICES_VERSION)}`;
  const SERVICES=[
    {id:'peinados',nombre:'Peinados',desc:'Peinados para eventos, brushing y más.',img:'https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=1400&auto=format&fit=crop'},
    {id:'cortes',nombre:'Cortes',desc:'Cortes clásicos y modernos para todas las edades.',img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1400&auto=format&fit=crop'},
    {id:'lavado',nombre:'Lavado',desc:'Lavado + masaje capilar con productos premium.',img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop'},
    {id:'coloracion',nombre:'Coloración',desc:'Técnicas de color, reflejos y cobertura.',img:'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop'}
  ];
  function block({nombre,desc,img,id},reverse){
    return `<div class="row service-block gy-3 ${reverse?'flex-lg-row-reverse':''}">
      <div class="col-lg-6"><img class="w-100 rounded-4 shadow" loading="lazy" alt="${nombre}" src="${img}"/></div>
      <div class="col-lg-6 d-flex"><div class="my-auto">
        <h3 class="h2">${nombre}</h3><p class="mb-3">${desc}</p>
        <div class="d-flex gap-2">
          <a class="btn btn-brand" target="_blank" rel="noopener" href="${pdfUrl(id)}"><i class="bi bi-filetype-pdf me-2"></i>Más información</a>
          <a class="btn btn-outline-light" href="#contacto"><i class="bi bi-calendar2-check me-2"></i>Reservar turno</a>
        </div></div></div></div>`;
  }
  document.getElementById('y').textContent=new Date().getFullYear();
  document.getElementById('serviciosAlt').innerHTML=SERVICES.map((s,i)=>block(s,i%2===1)).join('');
})();