import { useState, useEffect, useMemo, useCallback } from "react";

/* ─── Google Fonts ─── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap";
document.head.appendChild(fontLink);

/* ─── Global Styles ─── */
const globalStyle = document.createElement("style");
globalStyle.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #08090d; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; } 50% { opacity:0.5; }
  }
`;
document.head.appendChild(globalStyle);

/* ─── Palette ─── */
const C = {
  bg: "#08090d", surface: "#0f1117", card: "#13161f", card2: "#181c28",
  border: "rgba(255,255,255,0.07)", accent: "#e8b84b", accent2: "#ff6b6b",
  accent3: "#4ecdc4", accent4: "#a855f7", text: "#f0f0f0",
  muted: "#6b7280", muted2: "#9ca3af",
};
const PALETTE = ["#e8b84b","#ff6b6b","#4ecdc4","#a855f7","#06b6d4","#f97316","#84cc16","#ec4899","#14b8a6","#8b5cf6","#eab308","#ef4444","#22c55e","#3b82f6"];

/* ─── Data ─── */
const MOVIES = [
  {id:1,  title:"Inception",                          year:2010, genres:["Sci-Fi","Thriller","Action"],         rating:8.8, votes:2300000, director:"Christopher Nolan",    cast:["Leonardo DiCaprio","Joseph Gordon-Levitt"], poster:"🌀"},
  {id:2,  title:"The Dark Knight",                    year:2008, genres:["Action","Crime","Drama"],             rating:9.0, votes:2800000, director:"Christopher Nolan",    cast:["Christian Bale","Heath Ledger"],            poster:"🦇"},
  {id:3,  title:"Interstellar",                       year:2014, genres:["Sci-Fi","Adventure","Drama"],         rating:8.6, votes:1900000, director:"Christopher Nolan",    cast:["Matthew McConaughey","Anne Hathaway"],      poster:"🪐"},
  {id:4,  title:"Pulp Fiction",                       year:1994, genres:["Crime","Drama","Thriller"],           rating:8.9, votes:2100000, director:"Quentin Tarantino",   cast:["John Travolta","Uma Thurman"],              poster:"💼"},
  {id:5,  title:"The Shawshank Redemption",           year:1994, genres:["Drama"],                              rating:9.3, votes:2700000, director:"Frank Darabont",       cast:["Tim Robbins","Morgan Freeman"],             poster:"🔑"},
  {id:6,  title:"The Godfather",                      year:1972, genres:["Crime","Drama"],                      rating:9.2, votes:1900000, director:"Francis Ford Coppola", cast:["Marlon Brando","Al Pacino"],                poster:"🌹"},
  {id:7,  title:"The Matrix",                         year:1999, genres:["Sci-Fi","Action"],                    rating:8.7, votes:1900000, director:"The Wachowskis",       cast:["Keanu Reeves","Laurence Fishburne"],        poster:"💊"},
  {id:8,  title:"Forrest Gump",                       year:1994, genres:["Drama","Romance"],                    rating:8.8, votes:2100000, director:"Robert Zemeckis",      cast:["Tom Hanks","Robin Wright"],                 poster:"🏃"},
  {id:9,  title:"Goodfellas",                         year:1990, genres:["Crime","Drama","Biography"],          rating:8.7, votes:1200000, director:"Martin Scorsese",      cast:["Ray Liotta","Robert De Niro"],              poster:"🔫"},
  {id:10, title:"Fight Club",                         year:1999, genres:["Drama","Thriller"],                   rating:8.8, votes:2200000, director:"David Fincher",        cast:["Brad Pitt","Edward Norton"],                poster:"🥊"},
  {id:11, title:"Schindler's List",                   year:1993, genres:["Drama","History","Biography"],        rating:8.9, votes:1400000, director:"Steven Spielberg",     cast:["Liam Neeson","Ben Kingsley"],               poster:"📜"},
  {id:12, title:"The Silence of the Lambs",           year:1991, genres:["Crime","Drama","Thriller","Horror"],  rating:8.6, votes:1400000, director:"Jonathan Demme",       cast:["Jodie Foster","Anthony Hopkins"],           poster:"🦋"},
  {id:13, title:"Gladiator",                          year:2000, genres:["Action","Adventure","Drama"],          rating:8.5, votes:1400000, director:"Ridley Scott",         cast:["Russell Crowe","Joaquin Phoenix"],          poster:"⚔️"},
  {id:14, title:"The Lion King",                      year:1994, genres:["Animation","Adventure","Drama"],      rating:8.5, votes:1000000, director:"Roger Allers",         cast:["Matthew Broderick","Jeremy Irons"],         poster:"🦁"},
  {id:15, title:"Parasite",                           year:2019, genres:["Drama","Thriller","Comedy"],          rating:8.5, votes:800000,  director:"Bong Joon-ho",         cast:["Song Kang-ho","Lee Sun-kyun"],              poster:"🪜"},
  {id:16, title:"Avengers: Endgame",                  year:2019, genres:["Action","Adventure","Sci-Fi"],        rating:8.4, votes:1200000, director:"The Russo Brothers",   cast:["Robert Downey Jr.","Chris Evans"],          poster:"🦾"},
  {id:17, title:"Joker",                              year:2019, genres:["Crime","Drama","Thriller"],           rating:8.4, votes:1000000, director:"Todd Phillips",         cast:["Joaquin Phoenix","Robert De Niro"],         poster:"🃏"},
  {id:18, title:"Whiplash",                           year:2014, genres:["Drama","Music"],                      rating:8.5, votes:800000,  director:"Damien Chazelle",      cast:["Miles Teller","J.K. Simmons"],              poster:"🥁"},
  {id:19, title:"Mad Max: Fury Road",                 year:2015, genres:["Action","Adventure","Sci-Fi"],        rating:8.1, votes:900000,  director:"George Miller",        cast:["Tom Hardy","Charlize Theron"],              poster:"🚗"},
  {id:20, title:"La La Land",                         year:2016, genres:["Drama","Music","Romance"],            rating:8.0, votes:700000,  director:"Damien Chazelle",      cast:["Ryan Gosling","Emma Stone"],                poster:"🌆"},
  {id:21, title:"Get Out",                            year:2017, genres:["Horror","Mystery","Thriller"],        rating:7.7, votes:600000,  director:"Jordan Peele",         cast:["Daniel Kaluuya","Allison Williams"],        poster:"👁️"},
  {id:22, title:"Blade Runner 2049",                  year:2017, genres:["Sci-Fi","Drama","Mystery"],           rating:8.0, votes:500000,  director:"Denis Villeneuve",     cast:["Ryan Gosling","Harrison Ford"],             poster:"🌧️"},
  {id:23, title:"Arrival",                            year:2016, genres:["Sci-Fi","Drama","Mystery"],           rating:7.9, votes:600000,  director:"Denis Villeneuve",     cast:["Amy Adams","Jeremy Renner"],                poster:"🛸"},
  {id:24, title:"1917",                               year:2019, genres:["Drama","War","Action"],               rating:8.2, votes:500000,  director:"Sam Mendes",           cast:["George MacKay","Dean-Charles Chapman"],     poster:"🪖"},
  {id:25, title:"Everything Everywhere All at Once",  year:2022, genres:["Sci-Fi","Comedy","Action"],           rating:7.8, votes:400000,  director:"Daniels",              cast:["Michelle Yeoh","Ke Huy Quan"],              poster:"🌌"},
];

const USER_RATINGS = {
  user_001:{1:5,2:5,3:4,7:5,16:4,19:3}, user_002:{4:5,6:5,9:5,10:4,12:4,17:3},
  user_003:{5:5,8:5,11:5,14:4,18:4,20:4}, user_004:{1:4,3:5,7:4,22:5,23:5,25:4},
  user_005:{2:5,13:5,16:5,19:4,24:4,21:3}, user_006:{6:5,4:4,9:4,12:5,15:4,17:5},
  user_007:{18:5,20:5,14:4,8:4,5:3,11:4}, demo:{1:5,3:4,7:5,10:4},
};

/* ─── Recommendation Engine ─── */
function allGenres() { return [...new Set(MOVIES.flatMap(m => m.genres))].sort(); }
function genreVec(movie) {
  return Object.fromEntries(allGenres().map(g => [g, movie.genres.includes(g) ? 1 : 0]));
}
function cosineSim(v1, v2) {
  const keys = new Set([...Object.keys(v1), ...Object.keys(v2)]);
  let dot=0,m1=0,m2=0;
  keys.forEach(k=>{ dot+=(v1[k]||0)*(v2[k]||0); m1+=(v1[k]||0)**2; m2+=(v2[k]||0)**2; });
  return (m1&&m2) ? dot/(Math.sqrt(m1)*Math.sqrt(m2)) : 0;
}
function contentRec(id, n=6) {
  const t = MOVIES.find(m=>m.id===id); if(!t) return [];
  const tv = {...genreVec(t), rating: t.rating/10};
  return [...MOVIES].filter(m=>m.id!==id)
    .map(m => ({m, s: cosineSim({...genreVec(m), rating:m.rating/10}, tv) + (m.director===t.director?.2:0)}))
    .sort((a,b)=>b.s-a.s).slice(0,n).map(x=>x.m);
}
function collabRec(userId, n=6) {
  const ur = USER_RATINGS[userId]||{};
  if(!Object.keys(ur).length) return topRated(n);
  const sims={};
  Object.entries(USER_RATINGS).forEach(([uid,or])=>{
    if(uid===userId) return;
    const common=Object.keys(ur).filter(k=>or[k]);
    if(common.length<2) return;
    const v1={},v2={};
    common.forEach(k=>{v1[k]=ur[k];v2[k]=or[k];});
    sims[uid]={sim:cosineSim(v1,v2),ratings:or};
  });
  const ms={},mc={};
  Object.values(sims).forEach(({sim,ratings})=>{
    Object.entries(ratings).forEach(([mid,r])=>{
      if(!ur[mid]){ms[mid]=(ms[mid]||0)+sim*r; mc[mid]=(mc[mid]||0)+1;}
    });
  });
  const ranked=Object.keys(ms).sort((a,b)=>ms[b]/mc[b]-ms[a]/mc[a]);
  const res=ranked.slice(0,n).map(id=>MOVIES.find(m=>m.id==id)).filter(Boolean);
  return res.length?res:topRated(n);
}
function hybridRec(id, n=6) {
  const cb=contentRec(id,12), cf=collabRec("demo",12);
  const seen=new Set(),merged=[];
  const maxL=Math.max(cb.length,cf.length);
  for(let i=0;i<maxL;i++){
    if(cb[i]&&!seen.has(cb[i].id)&&cb[i].id!==id){seen.add(cb[i].id);merged.push(cb[i]);}
    if(cf[i]&&!seen.has(cf[i].id)&&cf[i].id!==id){seen.add(cf[i].id);merged.push(cf[i]);}
  }
  return merged.slice(0,n);
}
function topRated(n=6) { return [...MOVIES].sort((a,b)=>b.rating-a.rating).slice(0,n); }

/* ─── Reusable UI Primitives ─── */
const s = {
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px" },
  card2: { background: C.card2, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 14px", cursor: "pointer", transition: "all 0.25s" },
  sectionTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 1.5, color: C.muted2, marginBottom: 18, display: "flex", alignItems: "center", gap: 10 },
  genreTag: { fontSize: 10, padding: "2px 7px", borderRadius: 20, background: "rgba(255,255,255,0.06)", color: C.muted2 },
  ratingBadge: { display:"inline-flex", alignItems:"center", gap:4, fontSize:12, fontWeight:700, color:C.accent, background:"rgba(232,184,75,0.1)", padding:"2px 8px", borderRadius:20 },
};

/* ─── Sub-components ─── */
function SectionTitle({ children, dot=true }) {
  return (
    <div style={s.sectionTitle}>
      {dot && <span style={{width:6,height:6,borderRadius:"50%",background:C.accent,flexShrink:0,display:"inline-block"}}/>}
      {children}
    </div>
  );
}

function GenreTag({ g }) { return <span style={s.genreTag}>{g}</span>; }

function RatingBadge({ rating }) { return <div style={s.ratingBadge}>⭐ {rating}</div>; }

function MovieCard({ movie, onClick, selected }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onClick?.(movie)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...s.card2,
        transform: hov ? "translateY(-5px)" : "none",
        borderColor: selected ? C.accent : hov ? "rgba(232,184,75,0.3)" : C.border,
        boxShadow: selected ? `0 0 0 1px ${C.accent}, 0 0 40px rgba(232,184,75,0.15)` : hov ? "0 12px 32px rgba(0,0,0,0.4)" : "none",
        animation: "fadeUp 0.3s ease both",
      }}
    >
      <div style={{fontSize:42,textAlign:"center",marginBottom:12}}>{movie.poster}</div>
      <div style={{fontSize:13,fontWeight:600,marginBottom:4,lineHeight:1.3}}>{movie.title}</div>
      <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{movie.year} · {movie.director}</div>
      <RatingBadge rating={movie.rating} />
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>
        {movie.genres.map(g=><GenreTag key={g} g={g}/>)}
      </div>
    </div>
  );
}

function TopListItem({ movie, rank, onClick }) {
  const [hov,setHov]=useState(false);
  return (
    <div
      onClick={()=>onClick?.(movie)}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer",transition:"all 0.2s",paddingLeft:hov?8:0}}
    >
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:rank<=3?C.accent:C.muted,width:28,textAlign:"center",flexShrink:0}}>{rank}</div>
      <div style={{fontSize:26,flexShrink:0}}>{movie.poster}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:600}}>{movie.title}</div>
        <div style={{fontSize:11,color:C.muted}}>{movie.year} · {movie.director}</div>
      </div>
      <div style={{fontSize:13,fontWeight:700,color:C.accent,flexShrink:0}}>⭐ {movie.rating}</div>
    </div>
  );
}

function BarChart({ data, colorOffset=0 }) {
  const max = Math.max(...data.map(d=>d.value));
  return (
    <div>
      {data.map(({label,value},i)=>(
        <div key={label} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{fontSize:12,color:C.muted2,width:90,flexShrink:0,textAlign:"right"}}>{label}</div>
          <div style={{flex:1,background:"rgba(255,255,255,0.06)",borderRadius:4,height:8,overflow:"hidden"}}>
            <div style={{width:`${value/max*100}%`,height:"100%",borderRadius:4,background:PALETTE[(i+colorOffset)%PALETTE.length],transition:"width 0.8s cubic-bezier(0.16,1,0.3,1)"}}/>
          </div>
          <div style={{fontSize:11,color:C.muted,width:36,flexShrink:0}}>{typeof value==="number"&&value<20?value.toFixed(2):value}</div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, sub, colorIdx=0 }) {
  return (
    <div style={{...s.card,position:"relative",overflow:"hidden",transition:"transform 0.2s"}}>
      <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,borderRadius:"50%",background:PALETTE[colorIdx],opacity:0.08}}/>
      <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:1.5,color:C.muted,marginBottom:10}}>{label}</div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:42,letterSpacing:1,lineHeight:1,color:PALETTE[colorIdx]}}>{value}</div>
      <div style={{fontSize:12,color:C.muted2,marginTop:6}}>{sub}</div>
    </div>
  );
}

/* ─── Pages ─── */
function DashboardPage({ onMovieClick }) {
  const genreCount = useMemo(()=>{
    const gc={};
    MOVIES.forEach(m=>m.genres.forEach(g=>{gc[g]=(gc[g]||0)+1;}));
    return Object.entries(gc).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([label,value])=>({label,value}));
  },[]);

  const decadeData = useMemo(()=>{
    const d={};
    MOVIES.forEach(m=>{
      const dec=Math.floor(m.year/10)*10;
      if(!d[dec])d[dec]={sum:0,count:0};
      d[dec].sum+=m.rating; d[dec].count++;
    });
    return Object.entries(d).sort((a,b)=>+a[0]-+b[0]).map(([dec,{sum,count}])=>({
      label:`${dec}s`, value:+(sum/count).toFixed(2), count
    }));
  },[]);

  const featured = useMemo(()=>[...MOVIES].sort(()=>0.5-Math.random()).slice(0,6),[]);
  const top5 = useMemo(()=>topRated(8),[]);

  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:44,letterSpacing:2,lineHeight:1}}>
          CINE<span style={{color:C.accent}}>MATCH</span> DASHBOARD
        </div>
        <div style={{color:C.muted2,fontSize:14,marginTop:6,fontWeight:300}}>Your personalized movie intelligence platform</div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
        <StatCard label="Total Movies" value="25" sub="in our catalog" colorIdx={0}/>
        <StatCard label="Avg Rating" value="8.5" sub="⭐ IMDb weighted" colorIdx={1}/>
        <StatCard label="Active Users" value="8" sub="rating profiles" colorIdx={2}/>
        <StatCard label="Top Genre" value="Drama" sub="most represented" colorIdx={3}/>
      </div>

      {/* Genre + Hall of Fame */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        <div style={s.card}>
          <SectionTitle>Genre Distribution</SectionTitle>
          <BarChart data={genreCount}/>
        </div>
        <div style={s.card}>
          <SectionTitle>Hall of Fame</SectionTitle>
          {top5.map((m,i)=><TopListItem key={m.id} movie={m} rank={i+1} onClick={onMovieClick}/>)}
        </div>
      </div>

      {/* Decade */}
      <div style={{...s.card,marginBottom:24}}>
        <SectionTitle>Average Rating by Decade</SectionTitle>
        {decadeData.map(({label,value,count},i)=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,fontSize:13}}>
            <div style={{color:C.muted,width:36,fontSize:11,flexShrink:0}}>{label}</div>
            <div style={{flex:1,background:"rgba(255,255,255,0.04)",borderRadius:4,height:22,position:"relative",overflow:"hidden"}}>
              <div style={{width:`${value/10*100}%`,height:"100%",background:PALETTE[i%PALETTE.length],borderRadius:4,display:"flex",alignItems:"center",padding:"0 8px",fontSize:10,fontWeight:600,color:"rgba(0,0,0,0.8)"}}>
                ⭐ {value} ({count} film{count>1?"s":""})
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured */}
      <div style={s.card}>
        <SectionTitle>Featured Picks</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:16}}>
          {featured.map(m=><MovieCard key={m.id} movie={m} onClick={onMovieClick}/>)}
        </div>
      </div>
    </div>
  );
}

function DiscoverPage({ onMovieClick }) {
  const [query,setQuery]=useState("");
  const [activeGenre,setActiveGenre]=useState(null);
  const genres=useMemo(()=>allGenres(),[]);

  const filtered=useMemo(()=>{
    const q=query.toLowerCase();
    return MOVIES.filter(m=>{
      const genreOk=!activeGenre||m.genres.includes(activeGenre);
      const qOk=!q||m.title.toLowerCase().includes(q)||m.director.toLowerCase().includes(q)||m.cast.some(c=>c.toLowerCase().includes(q));
      return genreOk&&qOk;
    });
  },[query,activeGenre]);

  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:44,letterSpacing:2,lineHeight:1}}>
          DISCOVER <span style={{color:C.accent}}>MOVIES</span>
        </div>
        <div style={{color:C.muted2,fontSize:14,marginTop:6,fontWeight:300}}>Browse the entire catalog — filter by genre or search</div>
      </div>

      {/* Search */}
      <div style={{display:"flex",gap:12,marginBottom:16}}>
        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          placeholder="Search movies, directors, cast…"
          style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 18px",color:C.text,fontFamily:"inherit",fontSize:14,outline:"none"}}
        />
        <button onClick={()=>{setQuery("");setActiveGenre(null);}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 20px",color:C.text,fontFamily:"inherit",fontSize:14,cursor:"pointer"}}>Clear</button>
      </div>

      {/* Genre chips */}
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
        {[null,...genres].map(g=>(
          <button key={g||"all"} onClick={()=>setActiveGenre(g)}
            style={{background:activeGenre===g?"rgba(232,184,75,0.12)":"transparent",border:`1px solid ${activeGenre===g?C.accent:C.border}`,borderRadius:20,padding:"6px 14px",fontSize:12,cursor:"pointer",color:activeGenre===g?C.accent:C.muted2,transition:"all 0.2s",fontFamily:"inherit"}}>
            {g||"All"}
          </button>
        ))}
      </div>

      <div style={s.card}>
        {filtered.length ? (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:16}}>
            {filtered.map(m=><MovieCard key={m.id} movie={m} onClick={onMovieClick}/>)}
          </div>
        ) : (
          <div style={{textAlign:"center",padding:40,color:C.muted2}}>
            <div style={{fontSize:48,marginBottom:12}}>🎭</div>
            <div>No movies match your search</div>
          </div>
        )}
      </div>
    </div>
  );
}

function RecommendPage({ initialMovie, onMovieClick }) {
  const [tab,setTab]=useState("content");
  const [query,setQuery]=useState(initialMovie?.title||"");
  const [seed,setSeed]=useState(initialMovie||null);
  const [showDropdown,setShowDropdown]=useState(false);

  useEffect(()=>{
    if(initialMovie){setSeed(initialMovie);setQuery(initialMovie.title);}
  },[initialMovie]);

  const dropdownMovies=useMemo(()=>{
    if(!query||query===seed?.title) return [];
    return MOVIES.filter(m=>m.title.toLowerCase().includes(query.toLowerCase())||m.director.toLowerCase().includes(query.toLowerCase())).slice(0,6);
  },[query,seed]);

  useEffect(()=>{setShowDropdown(dropdownMovies.length>0&&query!==seed?.title);},[dropdownMovies,query,seed]);

  const recs=useMemo(()=>{
    if(!seed) return [];
    if(tab==="content") return contentRec(seed.id);
    if(tab==="collab") return collabRec("demo");
    return hybridRec(seed.id);
  },[seed,tab]);

  const tabLabel=tab==="content"?`Because you liked "${seed?.title}" — Content-Based`:tab==="collab"?"Users like you also loved — Collaborative Filtering":"Best of both worlds — Hybrid AI Mix";

  const pickSeed=(m)=>{setSeed(m);setQuery(m.title);setShowDropdown(false);};

  const TABS=[["content","🎭 Content-Based"],["collab","👥 Collaborative"],["hybrid","⚡ Hybrid Mix"]];

  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:44,letterSpacing:2,lineHeight:1}}>
          GET <span style={{color:C.accent}}>RECOMMENDATIONS</span>
        </div>
        <div style={{color:C.muted2,fontSize:14,marginTop:6,fontWeight:300}}>Choose a movie you love, get AI-powered suggestions</div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {TABS.map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{padding:"8px 18px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:500,color:tab===id?C.accent:C.muted2,background:tab===id?"rgba(232,184,75,0.1)":"transparent",border:`1px solid ${tab===id?"rgba(232,184,75,0.3)":"transparent"}`,transition:"all 0.2s",fontFamily:"inherit"}}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:20}}>
        <div style={{display:"flex",gap:12}}>
          <input value={query} onChange={e=>setQuery(e.target.value)} onFocus={()=>query&&setShowDropdown(true)}
            placeholder="Pick a seed movie…"
            style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 18px",color:C.text,fontFamily:"inherit",fontSize:14,outline:"none"}}/>
          <button onClick={()=>seed&&setSeed(s=>({...s}))}
            style={{background:C.accent,color:"#000",border:"none",borderRadius:12,padding:"12px 22px",fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:"pointer"}}>
            ✨ Get Recs
          </button>
        </div>
        {showDropdown&&(
          <div style={{position:"absolute",top:"100%",left:0,right:80,background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,zIndex:100,marginTop:4,overflow:"hidden",boxShadow:"0 16px 40px rgba(0,0,0,0.5)"}}>
            {dropdownMovies.map(m=>(
              <div key={m.id} onClick={()=>pickSeed(m)}
                style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer",borderBottom:`1px solid ${C.border}`,transition:"background 0.15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{fontSize:24}}>{m.poster}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{m.title}</div>
                  <div style={{fontSize:11,color:C.muted}}>{m.year} · {m.director}</div>
                </div>
                <div style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:C.accent}}>⭐ {m.rating}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Movie Detail */}
      {seed&&(
        <div style={{...s.card,display:"flex",gap:24,marginBottom:24,animation:"fadeUp 0.3s ease"}}>
          <div style={{fontSize:80,flexShrink:0,width:100,textAlign:"center"}}>{seed.poster}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:1,marginBottom:4}}>{seed.title}</div>
            <div style={{color:C.muted2,fontSize:13,marginBottom:8}}>{seed.year}</div>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(232,184,75,0.1)",border:"1px solid rgba(232,184,75,0.3)",padding:"4px 14px",borderRadius:20,color:C.accent,fontWeight:700,fontSize:16,marginBottom:12}}>
              ⭐ {seed.rating} <span style={{fontSize:11,color:C.muted,marginLeft:4,fontWeight:400}}>({(seed.votes/1e6).toFixed(1)}M votes)</span>
            </div>
            <div style={{fontSize:13,color:C.muted2,marginBottom:6}}>🎬 {seed.director}</div>
            <div style={{fontSize:13,color:C.muted2,marginBottom:10}}>🎭 {seed.cast.join(", ")}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{seed.genres.map(g=><GenreTag key={g} g={g}/>)}</div>
          </div>
        </div>
      )}

      {/* Recs */}
      {seed&&recs.length>0&&(
        <div style={s.card}>
          <SectionTitle>{tabLabel}</SectionTitle>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:16}}>
            {recs.map(m=><MovieCard key={m.id} movie={m} onClick={pickSeed}/>)}
          </div>
        </div>
      )}

      {!seed&&(
        <div style={{textAlign:"center",padding:60,color:C.muted2}}>
          <div style={{fontSize:56,marginBottom:16}}>🎬</div>
          <div style={{fontSize:16,fontWeight:500}}>Search for a movie above to get started</div>
          <div style={{fontSize:13,marginTop:6}}>Try "Inception", "Parasite", or any director's name</div>
        </div>
      )}
    </div>
  );
}

function AnalyticsPage() {
  const ratingDist=useMemo(()=>{
    const b={"7.5–8.0":0,"8.0–8.5":0,"8.5–9.0":0,"9.0+":0};
    MOVIES.forEach(m=>{
      if(m.rating>=9.0)b["9.0+"]++;
      else if(m.rating>=8.5)b["8.5–9.0"]++;
      else if(m.rating>=8.0)b["8.0–8.5"]++;
      else b["7.5–8.0"]++;
    });
    return Object.entries(b).map(([label,value])=>({label,value}));
  },[]);

  const genrePerf=useMemo(()=>{
    const gr={};
    MOVIES.forEach(m=>m.genres.forEach(g=>{if(!gr[g])gr[g]=[];gr[g].push(m.rating);}));
    return Object.entries(gr)
      .map(([label,rs])=>({label,value:+(rs.reduce((a,b)=>a+b,0)/rs.length).toFixed(2)}))
      .sort((a,b)=>b.value-a.value).slice(0,8);
  },[]);

  const directors=useMemo(()=>{
    const dm={};
    MOVIES.forEach(m=>{if(!dm[m.director])dm[m.director]={count:0,sum:0};dm[m.director].count++;dm[m.director].sum+=m.rating;});
    return Object.entries(dm).filter(([,d])=>d.count>1).sort((a,b)=>b[1].count-a[1].count);
  },[]);

  const votesSorted=useMemo(()=>[...MOVIES].sort((a,b)=>b.votes-a.votes),[]);
  const maxVotes=votesSorted[0].votes;

  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:44,letterSpacing:2,lineHeight:1}}>
          ANALYTICS <span style={{color:C.accent}}>&amp; INSIGHTS</span>
        </div>
        <div style={{color:C.muted2,fontSize:14,marginTop:6,fontWeight:300}}>Deep dive into the movie data intelligence</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        <div style={s.card}><SectionTitle>Rating Distribution</SectionTitle><BarChart data={ratingDist}/></div>
        <div style={s.card}><SectionTitle>Genre Performance</SectionTitle><BarChart data={genrePerf} colorOffset={4}/></div>
      </div>

      {/* Directors */}
      <div style={{...s.card,marginBottom:24}}>
        <SectionTitle>Director Spotlight</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
          {directors.map(([name,d],i)=>(
            <div key={name} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
              <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:1.5,color:C.muted,marginBottom:6}}>{name}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:PALETTE[i%PALETTE.length]}}>{d.count} Films</div>
              <div style={{fontSize:12,color:C.muted2,marginTop:4}}>Avg ⭐ {(d.sum/d.count).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Votes matrix */}
      <div style={s.card}>
        <SectionTitle>Votes vs Rating Matrix</SectionTitle>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {votesSorted.map((m,i)=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:170,fontSize:12,color:C.muted2,textAlign:"right",flexShrink:0}}>{m.poster} {m.title}</div>
              <div style={{flex:1,background:"rgba(255,255,255,0.05)",borderRadius:4,height:16,overflow:"hidden"}}>
                <div style={{width:`${m.votes/maxVotes*100}%`,height:"100%",background:PALETTE[i%PALETTE.length],opacity:0.8,borderRadius:4,transition:"width 0.8s"}}/>
              </div>
              <div style={{fontSize:11,color:C.muted,width:44,flexShrink:0}}>{(m.votes/1e6).toFixed(1)}M</div>
              <div style={{fontSize:11,fontWeight:700,color:C.accent,width:36,flexShrink:0}}>⭐{m.rating}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopChartsPage({ onMovieClick }) {
  const byRating=useMemo(()=>[...MOVIES].sort((a,b)=>b.rating-a.rating).slice(0,8),[]);
  const byVotes=useMemo(()=>[...MOVIES].sort((a,b)=>b.votes-a.votes).slice(0,8),[]);
  const byYear=useMemo(()=>[...MOVIES].sort((a,b)=>b.year-a.year).slice(0,8),[]);
  return (
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{marginBottom:32}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:44,letterSpacing:2,lineHeight:1}}>
          TOP <span style={{color:C.accent}}>CHARTS</span>
        </div>
        <div style={{color:C.muted2,fontSize:14,marginTop:6,fontWeight:300}}>The definitive rankings of cinema's finest</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
        <div style={s.card}><SectionTitle>🏆 Highest Rated</SectionTitle>{byRating.map((m,i)=><TopListItem key={m.id} movie={m} rank={i+1} onClick={onMovieClick}/>)}</div>
        <div style={s.card}><SectionTitle>🔥 Most Voted</SectionTitle>{byVotes.map((m,i)=><TopListItem key={m.id} movie={m} rank={i+1} onClick={onMovieClick}/>)}</div>
        <div style={s.card}><SectionTitle>🕹️ Most Recent</SectionTitle>{byYear.map((m,i)=><TopListItem key={m.id} movie={m} rank={i+1} onClick={onMovieClick}/>)}</div>
      </div>
    </div>
  );
}

/* ─── NAV CONFIG ─── */
const NAV=[
  {id:"dashboard", icon:"📊", label:"Dashboard"},
  {id:"discover",  icon:"🎬", label:"Discover"},
  {id:"recommend", icon:"✨", label:"Recommend"},
  {id:"analytics", icon:"📈", label:"Analytics"},
  {id:"topcharts", icon:"🏆", label:"Top Charts"},
];

/* ─── ROOT APP ─── */
export default function App() {
  const [page,setPage]=useState("dashboard");
  const [seedMovie,setSeedMovie]=useState(null);

  const handleMovieClick=useCallback((movie)=>{
    setSeedMovie(movie);
    setPage("recommend");
  },[]);

  const navigateTo=useCallback((id)=>{
    if(id!=="recommend") setSeedMovie(null);
    setPage(id);
  },[]);

  const renderPage=()=>{
    switch(page){
      case "dashboard": return <DashboardPage onMovieClick={handleMovieClick}/>;
      case "discover":  return <DiscoverPage onMovieClick={handleMovieClick}/>;
      case "recommend": return <RecommendPage initialMovie={seedMovie} onMovieClick={handleMovieClick}/>;
      case "analytics": return <AnalyticsPage/>;
      case "topcharts": return <TopChartsPage onMovieClick={handleMovieClick}/>;
      default: return null;
    }
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',sans-serif"}}>
      {/* Sidebar */}
      <nav style={{width:240,flexShrink:0,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"28px 0",position:"sticky",top:0,height:"100vh"}}>
        {/* Logo */}
        <div style={{padding:"0 24px 28px",borderBottom:`1px solid ${C.border}`,marginBottom:20}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:3,color:C.accent,lineHeight:1}}>CineMatch</div>
          <div style={{fontSize:11,color:C.muted,letterSpacing:2,textTransform:"uppercase",marginTop:4}}>AI · Recommendations</div>
        </div>

        {/* Nav */}
        {NAV.map(({id,icon,label})=>{
          const active=page===id;
          return (
            <div key={id} onClick={()=>navigateTo(id)}
              style={{display:"flex",alignItems:"center",gap:12,padding:"12px 24px",cursor:"pointer",transition:"all 0.2s",borderLeft:`3px solid ${active?C.accent:"transparent"}`,background:active?"rgba(232,184,75,0.06)":"transparent",color:active?C.accent:C.muted2}}>
              <span style={{fontSize:18,width:20,textAlign:"center"}}>{icon}</span>
              <span style={{fontSize:14,fontWeight:500}}>{label}</span>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{marginTop:"auto",padding:"20px 24px",borderTop:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:C.card,borderRadius:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#e8b84b,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#000",flexShrink:0}}>D</div>
            <div>
              <div style={{fontSize:13,fontWeight:500}}>Demo User</div>
              <div style={{fontSize:11,color:C.muted}}>Cinephile</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{flex:1,overflowY:"auto",padding:"36px 40px"}}>
        {renderPage()}
      </main>
    </div>
  );
}
