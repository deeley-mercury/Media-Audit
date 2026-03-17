import { useState, useRef, useMemo } from "react";

const API = "https://api.anthropic.com/v1/messages";
const RED = "#c8271e";
const BG = "#f4f4f2";
const CARD = "#ffffff";
const BORDER = "#e0dedd";
const TEXT = "#1a1a1a";
const MUTED = "#888";
const COLORS = [RED,"#2563eb","#16a34a","#d97706","#7c3aed","#0891b2","#db2777"];

const WW_DATA = {id:"ww_preloaded",publicationName:"Willamette Week",isMercury:false,demographics:{age:[{label:"18–24",pct:3.1,index:28},{label:"25–34",pct:9.7,index:58},{label:"35–44",pct:28.5,index:160},{label:"45–49",pct:15.2,index:192},{label:"50–54",pct:10.2,index:128},{label:"55–64",pct:12.7,index:85},{label:"65–74",pct:12.9,index:93},{label:"75+",pct:7.6,index:79}],income:[{label:"Under $50K",pct:28.2,index:69},{label:"$50K–$74,999",pct:10.4,index:58},{label:"$75K–$99,999",pct:16.9,index:111},{label:"$100K–$149,999",pct:24.8,index:184},{label:"$150K–$199,999",pct:11.6,index:153},{label:"$200K–$299,999",pct:5.8,index:193},{label:"$500K+",pct:2.3,index:227}],education:[{label:"HS or Less",pct:15.0,index:53},{label:"Some College",pct:23.6,index:76},{label:"College Graduate",pct:37.2,index:143},{label:"Advanced Degree",pct:24.2,index:229}]},shopping:[{category:"Business Owner / Corp Officer",pct:11.1,index:228},{category:"B2B Decision Makers",pct:18.9,index:181},{category:"White Collar Workers",pct:51.6,index:169},{category:"Opinion Leader",pct:12.0,index:274},{category:"Traded Stocks/Bonds Past Year",pct:36.7,index:166},{category:"Liquid Assets $100K+",pct:46.6,index:187},{category:"IRA / Roth IRA",pct:51.8,index:213},{category:"Mutual Funds",pct:29.0,index:251},{category:"401K Plan",pct:49.6,index:153},{category:"Liquid Assets $500K+",pct:23.9,index:259},{category:"Plan Buy New Car/Truck/SUV",pct:28.2,index:239},{category:"Plan Buy Electric Vehicle",pct:11.8,index:321},{category:"Plan Buy Hybrid Vehicle",pct:14.4,index:224},{category:"Any Air Travel Past Year",pct:72.9,index:172},{category:"Foreign Air Travel 1+ Trips",pct:29.3,index:172},{category:"Primary Business Air Traveler",pct:22.8,index:207},{category:"Home Improvement Done (Any)",pct:51.2,index:170},{category:"Plan Home Improvement (Any)",pct:47.8,index:160},{category:"Shopped REI (6 mo)",pct:17.7,index:305},{category:"Shopped Macy's (6 mo)",pct:26.7,index:174},{category:"Whole Foods (weekly)",pct:10.1,index:250},{category:"Trader Joe's (weekly)",pct:22.5,index:208},{category:"Charitable Contributions Past Year",pct:64.8,index:155},{category:"Two Income Family",pct:35.4,index:187},{category:"Locally Owned Shopping (4 wk)",pct:70.5,index:177},{category:"LinkedIn (monthly)",pct:42.1,index:142},{category:"Work From Home – Always",pct:16.7,index:200}],lifestyle:[{category:"Visited Bars / Nightclubs (4 wk)",pct:37.5,index:237},{category:"Art Gallery (past year)",pct:23.5,index:239},{category:"Culture Lover",pct:34.5,index:170},{category:"Museum (past year)",pct:29.3,index:156},{category:"Rock/Pop Concert (past year)",pct:32.5,index:186},{category:"Street Fair (past year)",pct:36.1,index:181},{category:"Hiking",pct:32.8,index:202},{category:"Biking / Cycling",pct:19.6,index:179},{category:"Boating / Sailing",pct:22.1,index:295},{category:"Snow Skiing / Boarding",pct:10.2,index:199},{category:"Camping",pct:39.7,index:128},{category:"MLS Fan (Portland Timbers)",pct:18.8,index:297},{category:"NBA Fan",pct:46.8,index:194},{category:"NFL Fan",pct:53.2,index:148},{category:"NBA Game Attended",pct:16.3,index:325},{category:"Portland Timbers Attended",pct:11.7,index:511},{category:"Wine (past week)",pct:54.8,index:195},{category:"Hard Cider (past week)",pct:31.0,index:189},{category:"Beer (past week)",pct:57.3,index:174},{category:"Cannabis / Marijuana Use",pct:49.6,index:152},{category:"Podcast Listener (monthly)",pct:59.1,index:173},{category:"Eco-Friendly: Buy Organic",pct:57.9,index:186},{category:"Eco-Friendly: Buy Local",pct:55.0,index:153},{category:"Eco-Friendly: Participate",pct:40.3,index:281},{category:"Health Club (12+ visits/yr)",pct:24.4,index:200},{category:"Eco-Friendly Products Purchase",pct:45.0,index:197}]};

const MERCURY_DATA = {id:"mercury_preloaded",publicationName:"Portland Mercury",isMercury:true,demographics:{age:[{label:"18–24",pct:9.3,index:85},{label:"25–34",pct:10.1,index:61},{label:"35–44",pct:27.3,index:153},{label:"45–49",pct:16.8,index:212},{label:"50–54",pct:5.4,index:68},{label:"55–64",pct:12.3,index:82},{label:"65–74",pct:12.5,index:90},{label:"75+",pct:6.3,index:65}],income:[{label:"Under $50K",pct:21.1,index:52},{label:"$50K–$74,999",pct:20.9,index:117},{label:"$75K–$99,999",pct:17.0,index:111},{label:"$100K–$149,999",pct:20.9,index:155},{label:"$150K–$199,999",pct:12.3,index:162},{label:"$200K–$299,999",pct:4.9,index:163},{label:"$300K+",pct:2.9,index:138},{label:"$500K+",pct:2.9,index:286}],education:[{label:"HS or Less",pct:18.5,index:56},{label:"Some College",pct:27.3,index:88},{label:"College Graduate",pct:28.6,index:110},{label:"Advanced Degree",pct:25.6,index:243}]},shopping:[{category:"Business Owner / Corp Officer",pct:11.5,index:236},{category:"B2B Decision Makers",pct:23.5,index:225},{category:"White Collar Workers",pct:50.1,index:164},{category:"Proprietors & Managers",pct:28.3,index:228},{category:"Opinion Leader",pct:8.7,index:199},{category:"Traded Stocks/Bonds Past Year",pct:47.8,index:216},{category:"Liquid Assets $100K+",pct:42.7,index:171},{category:"401K Plan",pct:47.8,index:148},{category:"Mutual Funds",pct:17.3,index:150},{category:"IRA / Roth IRA",pct:31.5,index:130},{category:"Financial Optimist (next 6 mo)",pct:51.1,index:143},{category:"Plan Buy New Car/Truck/SUV",pct:25.1,index:213},{category:"Plan Buy Electric Vehicle",pct:15.8,index:431},{category:"Any Air Travel Past Year",pct:69.4,index:164},{category:"Foreign Air Travel 1+ Trips",pct:41.8,index:246},{category:"Primary Business Air Traveler",pct:26.9,index:245},{category:"Home Improvement Done (Any)",pct:42.3,index:141},{category:"Plan Home Improvement (Any)",pct:45.0,index:151},{category:"Shopped REI (6 mo)",pct:12.1,index:208},{category:"Shopped Macy's (6 mo)",pct:31.7,index:207},{category:"Whole Foods (weekly)",pct:6.7,index:164},{category:"Costco (weekly)",pct:35.9,index:126},{category:"Attended Movie Theater (4 wk)",pct:25.5,index:159},{category:"Charitable Contributions Past Year",pct:54.0,index:129},{category:"Plan Buy/Build New Home (2 yr)",pct:18.8,index:142},{category:"Work From Home – Part-Time",pct:24.9,index:244},{category:"LinkedIn (monthly)",pct:46.2,index:156},{category:"Two Income Family",pct:32.9,index:174}],lifestyle:[{category:"Bicycle Transportation",pct:10.8,index:468},{category:"Ride Share (past week)",pct:25.6,index:248},{category:"Snow Skiing / Boarding",pct:11.5,index:226},{category:"Swimming",pct:20.0,index:212},{category:"Jogging / Running",pct:22.5,index:164},{category:"Biking / Cycling",pct:18.2,index:166},{category:"Hiking",pct:24.8,index:153},{category:"Camping",pct:47.5,index:153},{category:"Fishing",pct:37.8,index:193},{category:"Boating / Sailing",pct:15.7,index:209},{category:"Visited Bars / Nightclubs (4 wk)",pct:27.2,index:172},{category:"Art Gallery (past year)",pct:19.1,index:194},{category:"Museum (past year)",pct:26.3,index:140},{category:"Culture Lover",pct:27.1,index:134},{category:"Rock/Pop Concert (past year)",pct:21.8,index:125},{category:"MLS Fan (Portland Timbers)",pct:18.3,index:217},{category:"NBA Fan",pct:36.4,index:151},{category:"NHL Fan",pct:14.8,index:168},{category:"Esports Fan",pct:5.4,index:283},{category:"Wine (past week)",pct:44.2,index:157},{category:"Hard Cider (past week)",pct:26.0,index:158},{category:"Beer (past week)",pct:44.7,index:136},{category:"Cannabis / Marijuana Use",pct:44.9,index:138},{category:"OTC Hemp/CBD Products",pct:38.5,index:150},{category:"Podcast Listener (monthly)",pct:49.9,index:146},{category:"Eco-Friendly: Buy Organic",pct:38.9,index:125},{category:"Eco-Friendly: Buy Local",pct:43.8,index:122},{category:"VR Headset Owner",pct:22.8,index:183},{category:"Health Club (12+ visits/yr)",pct:19.0,index:156},{category:"Sportwager (online/mobile)",pct:22.8,index:199}]};

const OREGONIAN_DATA = {id:"oregonian_preloaded",publicationName:"The Oregonian",isMercury:false,demographics:{age:[{label:"18–24",pct:7.9,index:73},{label:"25–34",pct:18.1,index:108},{label:"35–44",pct:23.4,index:132},{label:"45–49",pct:12.1,index:152},{label:"50–54",pct:4.3,index:54},{label:"55–64",pct:10.7,index:71},{label:"65–74",pct:12.4,index:90},{label:"75+",pct:10.9,index:113}],income:[{label:"Under $50K",pct:32.3,index:79},{label:"$50K–$74,999",pct:19.6,index:110},{label:"$75K–$99,999",pct:17.2,index:113},{label:"$100K–$149,999",pct:14.3,index:106},{label:"$150K–$199,999",pct:8.8,index:116},{label:"$200K–$299,999",pct:4.9,index:161},{label:"$500K+",pct:1.4,index:141}],education:[{label:"HS or Less",pct:27.1,index:83},{label:"Some College",pct:29.8,index:96},{label:"College Graduate",pct:27.6,index:106},{label:"Advanced Degree",pct:15.3,index:145}]},shopping:[{category:"Business Owner / Corp Officer",pct:6.5,index:133},{category:"B2B Decision Makers",pct:16.3,index:156},{category:"White Collar Workers",pct:38.3,index:126},{category:"Opinion Leader",pct:8.0,index:182},{category:"Traded Stocks/Bonds Past Year",pct:30.0,index:136},{category:"Liquid Assets $100K+",pct:36.4,index:146},{category:"IRA / Roth IRA",pct:36.0,index:148},{category:"Mutual Funds",pct:18.6,index:161},{category:"401K Plan",pct:43.0,index:133},{category:"Financial Optimist (next 6 mo)",pct:41.8,index:117},{category:"Plan Buy New Car/Truck/SUV",pct:21.2,index:179},{category:"Plan Buy Electric Vehicle",pct:9.5,index:260},{category:"Any Air Travel Past Year",pct:57.2,index:135},{category:"Foreign Air Travel 1+ Trips",pct:25.9,index:152},{category:"Primary Business Air Traveler",pct:20.7,index:189},{category:"Home Improvement Done (Any)",pct:40.7,index:135},{category:"Plan Home Improvement (Any)",pct:37.4,index:125},{category:"Shopped REI (6 mo)",pct:11.5,index:198},{category:"Shopped Macy's (6 mo)",pct:24.6,index:161},{category:"Whole Foods (weekly)",pct:7.4,index:183},{category:"Trader Joe's (weekly)",pct:13.8,index:128},{category:"Charitable Contributions Past Year",pct:51.4,index:123},{category:"Two Income Family",pct:24.7,index:130},{category:"Locally Owned Shopping (4 wk)",pct:53.8,index:135},{category:"LinkedIn (monthly)",pct:45.6,index:154},{category:"Work From Home – Always",pct:12.5,index:150}],lifestyle:[{category:"Visited Bars / Nightclubs (4 wk)",pct:23.3,index:148},{category:"Art Gallery (past year)",pct:16.4,index:167},{category:"Culture Lover",pct:29.9,index:148},{category:"Museum (past year)",pct:28.2,index:150},{category:"Rock/Pop Concert (past year)",pct:21.1,index:121},{category:"Street Fair (past year)",pct:27.2,index:137},{category:"Hiking",pct:27.1,index:167},{category:"Biking / Cycling",pct:17.9,index:163},{category:"Boating / Sailing",pct:9.9,index:132},{category:"Snow Skiing / Boarding",pct:8.0,index:157},{category:"Camping",pct:38.9,index:125},{category:"Fishing",pct:30.3,index:155},{category:"MLS Fan (Portland Timbers)",pct:10.1,index:183},{category:"NBA Fan",pct:30.5,index:158},{category:"NFL Fan",pct:38.9,index:125},{category:"Wine (past week)",pct:37.6,index:134},{category:"Hard Cider (past week)",pct:23.2,index:142},{category:"Beer (past week)",pct:44.1,index:134},{category:"Cannabis / Marijuana Use",pct:43.0,index:132},{category:"Podcast Listener (monthly)",pct:43.6,index:127},{category:"Eco-Friendly: Buy Organic",pct:36.6,index:118},{category:"Eco-Friendly: Buy Local",pct:42.8,index:119},{category:"Health Club (12+ visits/yr)",pct:22.0,index:180},{category:"Sportwager (online/mobile)",pct:20.7,index:180},{category:"Jogging / Running",pct:22.0,index:160},{category:"Swimming",pct:15.9,index:169}]};

// Spotlight stats per publication — shown on profile hero
const SPOTLIGHT = {
  mercury_preloaded: [
    {label:"Ages 35–49",value:"183",note:"core sweet spot"},
    {label:"HHI $100K+",value:"156",note:"affluent skew"},
    {label:"Advanced Degree",value:"243",note:"highly educated"},
    {label:"B2B Decision Maker",value:"225",note:"business influencers"},
    {label:"Foreign Air Travel",value:"246",note:"frequent fliers"},
    {label:"Bicycle Transport",value:"468",note:"active commuters"},
  ],
  oregonian_preloaded: [
    {label:"Ages 35–49",value:"138",note:"primary sweet spot"},
    {label:"HHI $100K+",value:"117",note:"solid affluent skew"},
    {label:"Advanced Degree",value:"145",note:"educated audience"},
    {label:"Opinion Leader",value:"182",note:"highly influential"},
    {label:"Plan Buy EV",value:"260",note:"early adopters"},
    {label:"Business Air Travel",value:"189",note:"frequent fliers"},
  ],
    {label:"Ages 35–49",value:"176",note:"core sweet spot"},
    {label:"HHI $100K+",value:"184",note:"affluent skew"},
    {label:"Advanced Degree",value:"229",note:"highly educated"},
    {label:"Opinion Leader",value:"274",note:"influential readers"},
    {label:"Plan Buy EV",value:"321",note:"early adopters"},
    {label:"Timbers Attended",value:"511",note:"sports superfans"},
  ],
};

function toBase64(f){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});}

function safeArr(v){return Array.isArray(v)?v:[];}

function IndexBar({idx=0,color=RED}){
  const w=Math.min(Math.max(idx,0),300)/300*100,avg=(100/300)*100;
  return <div style={{position:"relative",height:16,background:"#ede9e8",borderRadius:3,overflow:"hidden"}}>
    <div style={{width:`${avg}%`,position:"absolute",height:"100%",borderRight:"1px solid #ccc"}}/>
    <div style={{width:`${w}%`,background:color,height:"100%",borderRadius:3,position:"absolute",opacity:0.8}}/>
    <span style={{position:"absolute",right:5,top:0,fontSize:11,color:idx>=120?"#fff":"#666",fontWeight:700,lineHeight:"16px"}}>{idx}</span>
  </div>;
}

function flattenPub(pub){
  const items=[];
  ["age","income","education"].forEach(dim=>{
    safeArr(pub.demographics?.[dim]).forEach(i=>items.push({section:`Demographics: ${dim.charAt(0).toUpperCase()+dim.slice(1)}`,label:i.label,pct:i.pct,index:i.index}));
  });
  safeArr(pub.shopping).forEach(i=>items.push({section:"Shopping & Purchase",label:i.category,pct:i.pct,index:i.index}));
  safeArr(pub.lifestyle).forEach(i=>items.push({section:"Lifestyle & Affinities",label:i.category,pct:i.pct,index:i.index}));
  return items;
}

const EXTRACT_PROMPT=`Analyze this media audience survey PDF. Return ONLY valid JSON, no markdown:
{"publicationName":"string","demographics":{"age":[{"label":"string","pct":number,"index":number}],"income":[{"label":"string","pct":number,"index":number}],"education":[{"label":"string","pct":number,"index":number}]},"shopping":[{"category":"string","pct":number,"index":number}],"lifestyle":[{"category":"string","pct":number,"index":number}]}`;

const SYNONYMS = {
  "bike":"bicycl,cycling,bicycle",
  "bikes":"bicycl,cycling,bicycle",
  "biking":"bicycl,cycling,bicycle",
  "cycling":"bicycl,cycling,bicycle",
  "car":"auto,vehicle,car,truck,suv",
  "cars":"auto,vehicle,car,truck,suv",
  "auto":"auto,vehicle,car,truck,suv",
  "autos":"auto,vehicle,car,truck,suv",
  "vehicle":"auto,vehicle,car,truck,suv",
  "truck":"auto,vehicle,car,truck,suv",
  "ev":"electric,hybrid",
  "electric car":"electric,hybrid",
  "weed":"cannabis,marijuana,hemp,cbd",
  "marijuana":"cannabis,marijuana,hemp,cbd",
  "pot":"cannabis,marijuana,hemp,cbd",
  "cannabis":"cannabis,marijuana,hemp,cbd",
  "cbd":"cannabis,hemp,cbd",
  "beer":"beer,alcohol,beverage,bar",
  "booze":"beer,wine,alcohol,beverage,bar,liquor",
  "wine":"wine,alcohol,beverage",
  "drinking":"beer,wine,alcohol,beverage,bar,liquor",
  "bar":"bar,nightclub,alcohol,beverage",
  "bars":"bar,nightclub,alcohol,beverage",
  "hike":"hiking,outdoor,camping",
  "hiking":"hiking,outdoor,camping",
  "outdoors":"hiking,camping,fishing,boating,skiing",
  "camping":"camping,outdoor",
  "ski":"skiing,snow",
  "skiing":"skiing,snow",
  "travel":"air travel,travel,vacation,flight",
  "flying":"air travel,travel,flight",
  "flight":"air travel,travel,flight",
  "vacation":"vacation,travel,air travel",
  "home improvement":"home improvement,remodel",
  "remodel":"home improvement,remodel",
  "investment":"stocks,401k,ira,mutual funds,liquid assets",
  "investing":"stocks,401k,ira,mutual funds,liquid assets",
  "stocks":"stocks,traded,liquid assets",
  "podcast":"podcast",
  "podcasts":"podcast",
  "music":"concert,music,rock",
  "concert":"concert,music,rock",
  "art":"art gallery,museum,culture",
  "museum":"museum,culture,art",
  "culture":"culture,art,museum",
  "sports":"sports,fan,nba,nfl,mls,nhl",
  "soccer":"mls,timbers,soccer",
  "basketball":"nba,basketball",
  "football":"nfl,football",
  "hockey":"nhl,hockey",
  "boomer":"baby boomer,boomers",
  "boomers":"baby boomer,boomers",
  "millennial":"millennial",
  "millennials":"millennial",
  "eco":"eco-friendly,organic,recycle",
  "green":"eco-friendly,organic,recycle",
  "organic":"organic,eco-friendly",
  "b2b":"b2b,business owner,decision maker",
  "business":"business owner,b2b,proprietor",
  "wealth":"liquid assets,income,affluent",
  "wealthy":"liquid assets,income,affluent",
  "rich":"liquid assets,income,affluent",
  "gym":"health club,exercise,fitness",
  "fitness":"health club,exercise,jogging,swimming",
  "exercise":"health club,exercise,jogging,swimming,hiking",
};

export default function App(){
  const [pubs,setPubs]=useState([MERCURY_DATA,WW_DATA,OREGONIAN_DATA]);
  const [tab,setTab]=useState("profile");
  const [loading,setLoading]=useState(false);
  const [loadMsg,setLoadMsg]=useState("");
  const [err,setErr]=useState("");
  const [compSel,setCompSel]=useState([]);
  const [searchQ,setSearchQ]=useState("");
  const [pitchPrompt,setPitchPrompt]=useState("");
  const [pitchPubs,setPitchPubs]=useState([]);
  const [pitchReport,setPitchReport]=useState(null);
  const [pitchLoading,setPitchLoading]=useState(false);
  const [newsItems,setNewsItems]=useState(null);
  const [newsLoading,setNewsLoading]=useState(false);
  const [copied,setCopied]=useState(false);
  const [profilePub,setProfilePub]=useState("mercury_preloaded");
  const compRef=useRef(),jsonRef=useRef();

  const mercury=pubs.find(p=>p.isMercury);
  const comps=pubs.filter(p=>!p.isMercury);

  // FIX: Expand query through SYNONYMS before searching
  const searchResults=useMemo(()=>{
    if(!searchQ.trim()||searchQ.length<2) return [];
    const q=searchQ.toLowerCase().trim();

    // Build set of terms: the raw query plus any synonym expansions
    const synonymExpansion=SYNONYMS[q];
    const terms=synonymExpansion
      ? synonymExpansion.split(",").map(t=>t.trim())
      : [q];

    function matchesAnyTerm(str){
      const lower=str.toLowerCase();
      return terms.some(t=>lower.includes(t));
    }

    const results={};
    pubs.forEach(pub=>{
      flattenPub(pub).forEach(item=>{
        if(matchesAnyTerm(item.label)||matchesAnyTerm(item.section)){
          const key=`${item.section}|||${item.label}`;
          if(!results[key]) results[key]={section:item.section,label:item.label,pubs:{}};
          results[key].pubs[pub.id]={index:item.index,pct:item.pct,pubName:pub.publicationName,isMercury:pub.isMercury};
        }
      });
    });
    return Object.values(results).sort((a,b)=>Math.max(...Object.values(b.pubs).map(p=>p.index))-Math.max(...Object.values(a.pubs).map(p=>p.index)));
  },[searchQ,pubs]);

  async function processPDF(file){
    setLoading(true);setLoadMsg(`Extracting ${file.name}…`);setErr("");
    try{
      const b64=await toBase64(file);
      const res=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,
          messages:[{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},{type:"text",text:EXTRACT_PROMPT}]}]})});
      const data=await res.json();
      if(data.error) throw new Error(data.error.message);
      const raw=data.content?.find(b=>b.type==="text")?.text||"";
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      parsed.isMercury=false;parsed.id=`pub_${Date.now()}`;
      setPubs(prev=>[...prev.filter(p=>p.isMercury||p.publicationName!==parsed.publicationName),parsed]);
    }catch(e){setErr("Failed: "+e.message);}
    finally{setLoading(false);}
  }

  async function fetchNews(goal){
    setNewsLoading(true);setNewsItems(null);
    try{
      const res=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:`Search for 3-4 recent 2025 Portland Oregon news stories relevant to this advertiser category: "${goal}". Return ONLY a JSON array, no markdown:\n[{"headline":"string","source":"string","summary":"one sentence","relevance":"one sentence on why this matters for pitching ads to this business type"}]`}]})});
      const data=await res.json();
      if(data.error) throw new Error(data.error.message);
      const texts=safeArr(data.content).filter(b=>b.type==="text");
      const raw=texts[texts.length-1]?.text||"[]";
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      setNewsItems(safeArr(parsed));
    }catch(e){setNewsItems([]);}
    finally{setNewsLoading(false);}
  }

  async function generatePitch(){
    if(!pitchPrompt.trim()) return;
    setPitchLoading(true);setPitchReport(null);setErr("");setNewsItems(null);
    fetchNews(pitchPrompt);
    const selPubs=pitchPubs.length>0?pubs.filter(p=>pitchPubs.includes(p.id)):[mercury];
    const pubData=selPubs.map(p=>({name:p.publicationName,isMercury:p.isMercury,demographics:p.demographics,shopping:safeArr(p.shopping),lifestyle:safeArr(p.lifestyle)}));
    const prompt=`You are a media sales strategist helping a Portland Mercury sales rep build a pitch.
Rep's goal: "${pitchPrompt}"
Publications data: ${JSON.stringify(pubData)}
Return ONLY valid JSON, no markdown, with EXACTLY these fields:
{"headline":"punchy sentence why Mercury is perfect","whyItWorks":"2-3 sentence rationale","topDataPoints":[{"label":"string","publication":"string","index":number,"pct":number,"insight":"string"}],"competitiveEdge":"2 sentences on Mercury advantage","pitchNarrative":"4-5 sentence verbatim pitch","objectionHandlers":[{"objection":"string","response":"string"}]}
Rules: topDataPoints must have 8-12 entries most relevant to this advertiser. objectionHandlers must have 2-3 entries.`;
    try{
      const res=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      if(data.error) throw new Error(data.error.message);
      const raw=data.content?.find(b=>b.type==="text")?.text||"";
      const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
      setPitchReport(parsed);
    }catch(e){setErr("Pitch error: "+e.message);}
    finally{setPitchLoading(false);}
  }

  function exportJSON(){const blob=new Blob([JSON.stringify(pubs,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);Object.assign(document.createElement("a"),{href:url,download:"media-audit.json"}).click();URL.revokeObjectURL(url);}
  function importJSON(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(Array.isArray(d))setPubs(d);else setErr("Invalid JSON.");}catch{setErr("Parse error.");}};r.readAsText(f);e.target.value="";}

  // ─── STYLES ───
  const card={background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,padding:20,marginBottom:16,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"};
  const h2={fontSize:15,fontWeight:700,margin:"0 0 14px",color:TEXT};
  const h3={fontSize:11,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.08em",margin:"0 0 10px"};
  const btn=(v="primary",dis=false)=>({background:v==="primary"?RED:"#fff",color:v==="primary"?"#fff":TEXT,border:v==="primary"?"none":`1px solid ${BORDER}`,padding:"9px 16px",borderRadius:5,fontSize:13,fontWeight:600,cursor:dis?"not-allowed":"pointer",opacity:dis?0.4:1,display:"inline-flex",alignItems:"center",gap:6,boxShadow:v==="primary"?"0 1px 3px rgba(200,39,30,0.3)":"0 1px 2px rgba(0,0,0,0.06)"});
  const inp={background:"#fff",border:`1px solid ${BORDER}`,color:TEXT,padding:"10px 14px",borderRadius:6,fontSize:13,width:"100%",boxSizing:"border-box"};

  const TABS=[
    {id:"profile",label:"★ Profiles"},
    {id:"compare",label:"⇄ Compare",locked:pubs.length<2},
    {id:"search",label:"🔍 Search"},
    {id:"pitch",label:"✦ Pitch Builder"},
    {id:"upload",label:"⬆ Add Competitors"}
  ];

  // ─── PROFILE ───
  // FIX: Use profilePub state to select which publication to display;
  // fall back gracefully if selected pub is removed.
  function ProfileTab(){
    const activePub = pubs.find(p=>p.id===profilePub) || pubs[0];
    if(!activePub) return <div style={{...card,color:MUTED}}>No publication data found.</div>;

    const isMerc = activePub.isMercury;
    const accentColor = isMerc ? RED : COLORS[pubs.findIndex(p=>p.id===activePub.id)%COLORS.length];
    const spotlightStats = SPOTLIGHT[activePub.id] || [];

    return <div>
      {/* Publication switcher */}
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {pubs.map((p,i)=>{
          const color = p.isMercury ? RED : COLORS[(i)%COLORS.length];
          const isActive = p.id === activePub.id;
          return <button key={p.id} onClick={()=>setProfilePub(p.id)}
            style={{padding:"8px 16px",borderRadius:6,fontSize:13,cursor:"pointer",fontWeight:isActive?700:400,
              background:isActive?color:"#fff",color:isActive?"#fff":MUTED,
              border:`2px solid ${isActive?color:BORDER}`,transition:"all 0.15s"}}>
            {p.isMercury?"★ ":""}{p.publicationName}
          </button>;
        })}
      </div>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,color:accentColor}}>{activePub.publicationName}</div>
          <div style={{fontSize:13,color:MUTED,marginTop:3}}>Reader Profile · Media Audit Winter 2025{activePub.id==="mercury_preloaded"?" · n=99":""}</div>
        </div>
        <div style={{fontSize:11,color:MUTED,background:"#fff",border:`1px solid ${BORDER}`,borderRadius:5,padding:"6px 12px",textAlign:"right",lineHeight:1.8}}>
          <div style={{fontWeight:700,marginBottom:2}}>Index Score Guide</div>
          <div><span style={{color:accentColor,fontWeight:700}}>150+</span> Strong over-index</div>
          <div><span style={{color:"#aaa"}}>100</span> = Portland average</div>
          <div><span style={{color:"#bbb"}}>80–</span> Under-index</div>
        </div>
      </div>

      {/* Spotlight stats (only shown if we have predefined highlights) */}
      {spotlightStats.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:16}}>
        {spotlightStats.map(s=>(
          <div key={s.label} style={{background:"#fff",border:`1px solid ${BORDER}`,borderRadius:6,padding:"12px 14px",textAlign:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:26,fontWeight:900,color:accentColor}}>{s.value}</div>
            <div style={{fontSize:12,fontWeight:700,color:TEXT,marginTop:2}}>{s.label}</div>
            <div style={{fontSize:11,color:MUTED}}>{s.note}</div>
          </div>
        ))}
      </div>}

      {/* Demographics */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:14,marginBottom:14}}>
        {[["Age",safeArr(activePub.demographics?.age)],["Household Income",safeArr(activePub.demographics?.income)],["Education",safeArr(activePub.demographics?.education)]].map(([label,data])=>
          data.length?<div key={label} style={card}><p style={h3}>{label}</p>{data.map((item,i)=><div key={i} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span>{item.label}</span><span style={{color:MUTED}}>{item.pct}%</span></div><IndexBar idx={item.index} color={accentColor}/></div>)}</div>:null
        )}
      </div>

      {/* Shopping + Lifestyle */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {safeArr(activePub.shopping).length>0&&<div style={card}><p style={h3}>Shopping & Purchase Behavior</p>{safeArr(activePub.shopping).map((item,i)=><div key={i} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span>{item.category}</span><span style={{color:item.index>=150?accentColor:MUTED,fontSize:11}}>{item.pct}%</span></div><IndexBar idx={item.index} color={accentColor}/></div>)}</div>}
        {safeArr(activePub.lifestyle).length>0&&<div style={card}><p style={h3}>Lifestyle & Affinities</p>{safeArr(activePub.lifestyle).map((item,i)=><div key={i} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span>{item.category}</span><span style={{color:item.index>=150?accentColor:MUTED,fontSize:11}}>{item.pct}%</span></div><IndexBar idx={item.index} color={accentColor}/></div>)}</div>}
      </div>
    </div>;
  }

  // ─── SEARCH ───
  function SearchTab(){
    const sections=[...new Set(searchResults.map(r=>r.section))];

    // Show synonym hint if one was used
    const q=searchQ.toLowerCase().trim();
    const synonymHint=SYNONYMS[q]?`Showing results for: ${SYNONYMS[q].split(",").join(", ")}`:null;

    return <div>
      <div style={card}>
        <p style={h2}>Search Audience Data</p>
        <p style={{color:MUTED,fontSize:13,marginTop:-10,marginBottom:14}}>Search across all loaded publications. Try "bike", "wine", "auto", "electric"…</p>
        <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Type to search…" style={{...inp,fontSize:15,padding:"12px 16px"}} autoFocus/>
        {searchQ.length>=2&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <span style={{color:MUTED,fontSize:12}}>{searchResults.length} result{searchResults.length!==1?"s":""}</span>
          {synonymHint&&<span style={{fontSize:11,color:"#2563eb",background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:4,padding:"2px 8px"}}>🔀 {synonymHint}</span>}
        </div>}
      </div>
      {searchQ.length>=2&&searchResults.length===0&&<div style={{...card,color:MUTED,textAlign:"center"}}>No results for "{searchQ}"</div>}
      {sections.map(sec=>(
        <div key={sec} style={{...card,marginBottom:14}}>
          <p style={h3}>{sec}</p>
          {searchResults.filter(r=>r.section===sec).map((result,i)=>(
            <div key={i} style={{marginBottom:18,paddingBottom:16,borderBottom:`1px solid ${BORDER}`}}>
              <div style={{fontSize:13,fontWeight:600,color:TEXT,marginBottom:8}}>{result.label}</div>
              {pubs.map((pub,pi)=>{
                const pd=result.pubs[pub.id];if(!pd)return null;
                const color=COLORS[pi%COLORS.length];
                return <div key={pub.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <span style={{fontSize:11,color,width:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pub.isMercury?"★ ":""}{pub.publicationName}</span>
                  <div style={{flex:1,position:"relative",height:16,background:"#ede9e8",borderRadius:3}}>
                    <div style={{width:`${Math.min((pd.index/300)*100,100)}%`,background:color,height:"100%",borderRadius:3,opacity:0.8}}/>
                    <div style={{width:`${(100/300)*100}%`,position:"absolute",top:0,height:"100%",borderRight:"1px solid #ccc"}}/>
                  </div>
                  <span style={{fontSize:11,color,width:34,textAlign:"right",fontWeight:700}}>{pd.index}</span>
                  {pd.pct!=null&&<span style={{fontSize:11,color:MUTED,width:38,textAlign:"right"}}>{pd.pct}%</span>}
                </div>;
              })}
            </div>
          ))}
        </div>
      ))}
    </div>;
  }

  // ─── COMPARE ───
  function CompareTab(){
    const selPubs=pubs.filter(p=>compSel.includes(p.id));
    const toggle=id=>setCompSel(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
    function CompSection({title,dataKey,itemKey}){
      if(selPubs.length<2) return null;
      const cats=[...new Set(selPubs.flatMap(p=>safeArr(p[dataKey]).map(i=>i[itemKey])))];
      if(!cats.length) return null;
      return <div style={{...card,marginBottom:14}}><p style={h2}>{title}</p>{cats.slice(0,20).map(cat=>(
        <div key={cat} style={{marginBottom:14}}>
          <div style={{fontSize:11,color:MUTED,marginBottom:5}}>{cat}</div>
          {selPubs.map(p=>{const item=safeArr(p[dataKey]).find(i=>i[itemKey]===cat);const idx=item?.index||0;const color=COLORS[pubs.findIndex(x=>x.id===p.id)%COLORS.length];return <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <span style={{fontSize:11,color,width:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.isMercury?"★ ":""}{p.publicationName}</span>
            <div style={{flex:1,position:"relative",height:16,background:"#ede9e8",borderRadius:3}}><div style={{width:`${Math.min((idx/300)*100,100)}%`,background:color,height:"100%",borderRadius:3,opacity:0.8}}/><div style={{width:`${(100/300)*100}%`,position:"absolute",top:0,height:"100%",borderRight:"1px solid #ccc"}}/></div>
            <span style={{fontSize:11,color,width:34,textAlign:"right",fontWeight:700}}>{idx||"–"}</span>
          </div>;})}
        </div>
      ))}</div>;
    }
    return <div>
      <div style={card}><p style={h2}>Select Publications to Compare</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {pubs.map((p,i)=>{const color=COLORS[i%COLORS.length],isSel=compSel.includes(p.id);return <button key={p.id} onClick={()=>toggle(p.id)} style={{padding:"7px 14px",borderRadius:5,fontSize:13,cursor:"pointer",fontWeight:isSel?700:400,background:isSel?color:"#f5f5f5",color:isSel?"#fff":MUTED,border:`1px solid ${isSel?color:BORDER}`}}>{p.isMercury?"★ ":""}{p.publicationName}</button>;})}
        </div>
        {selPubs.length<2&&<div style={{marginTop:12,fontSize:13,color:MUTED}}>Select at least 2 publications.</div>}
      </div>
      {selPubs.length>=2&&<>
        <CompSection title="Shopping & Purchase Behavior" dataKey="shopping" itemKey="category"/>
        <CompSection title="Lifestyle & Affinities" dataKey="lifestyle" itemKey="category"/>
        {["age","income","education"].map(dim=>{
          const labels=[...new Set(selPubs.flatMap(p=>safeArr(p.demographics?.[dim]).map(i=>i.label)))];
          if(!labels.length) return null;
          return <div key={dim} style={{...card,marginBottom:14}}><p style={h2}>Demographics — {dim.charAt(0).toUpperCase()+dim.slice(1)}</p>
            {labels.map(label=><div key={label} style={{marginBottom:14}}>
              <div style={{fontSize:11,color:MUTED,marginBottom:5}}>{label}</div>
              {selPubs.map(p=>{const item=safeArr(p.demographics?.[dim]).find(i=>i.label===label);const idx=item?.index||0;const color=COLORS[pubs.findIndex(x=>x.id===p.id)%COLORS.length];return <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:11,color,width:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.isMercury?"★ ":""}{p.publicationName}</span>
                <div style={{flex:1,position:"relative",height:16,background:"#ede9e8",borderRadius:3}}><div style={{width:`${Math.min((idx/300)*100,100)}%`,background:color,height:"100%",borderRadius:3,opacity:0.8}}/><div style={{width:`${(100/300)*100}%`,position:"absolute",top:0,height:"100%",borderRight:"1px solid #ccc"}}/></div>
                <span style={{fontSize:11,color,width:34,textAlign:"right",fontWeight:700}}>{idx||"–"}</span>
              </div>;})}</div>)}
          </div>;
        })}
      </>}
    </div>;
  }

  // ─── PITCH ───
  function PitchTab(){
    const dataPoints=safeArr(pitchReport?.topDataPoints);
    const objections=safeArr(pitchReport?.objectionHandlers);
    const news=safeArr(newsItems);
    return <div>
      <div style={card}>
        <p style={h2}>✦ AI Pitch Builder</p>
        <p style={{color:MUTED,fontSize:13,marginTop:-10,marginBottom:16}}>Describe your pitch goal and Claude will identify the most relevant audience data, pull recent Portland news, and write a ready-to-deliver pitch.</p>
        <div style={{marginBottom:14}}>
          <p style={{...h3,marginBottom:6}}>What's your pitch goal?</p>
          <textarea value={pitchPrompt} onChange={e=>setPitchPrompt(e.target.value)} rows={3}
            placeholder={"Examples:\n\"Pitch a local auto dealership\"\n\"Convince a Portland brewery to advertise\"\n\"Build a case for a real estate agent\""}
            style={{...inp,resize:"vertical",fontFamily:"inherit",lineHeight:1.5}}/>
        </div>
        <div style={{marginBottom:16}}>
          <p style={{...h3,marginBottom:6}}>Include publications (leave blank for Mercury only)</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {pubs.map((p,i)=>{const color=COLORS[i%COLORS.length],isSel=pitchPubs.includes(p.id);return <button key={p.id} onClick={()=>setPitchPubs(prev=>isSel?prev.filter(x=>x!==p.id):[...prev,p.id])} style={{padding:"6px 12px",borderRadius:5,fontSize:12,cursor:"pointer",fontWeight:isSel?700:400,background:isSel?color:"#f5f5f5",color:isSel?"#fff":MUTED,border:`1px solid ${isSel?color:BORDER}`}}>{p.isMercury?"★ ":""}{p.publicationName}</button>;})}
          </div>
          <div style={{fontSize:12,color:MUTED,marginTop:6}}>Default: Mercury only. Select multiple for competitive context.</div>
        </div>
        <button style={btn("primary",!pitchPrompt.trim()||pitchLoading)} onClick={generatePitch} disabled={!pitchPrompt.trim()||pitchLoading}>
          {pitchLoading?"⏳ Building report…":"✦ Generate Pitch Report"}
        </button>
      </div>

      {err&&<div style={{...card,borderColor:RED,color:"#dc2626",fontSize:13}}>⚠ {err}</div>}

      {pitchReport&&<div>
        <div style={{...card,background:"#fff8f7",borderColor:"#f5c5c3",borderLeft:`4px solid ${RED}`}}>
          <div style={{fontSize:18,fontWeight:800,color:RED,lineHeight:1.4}}>{pitchReport.headline||""}</div>
          <div style={{fontSize:14,color:"#444",marginTop:10,lineHeight:1.7}}>{pitchReport.whyItWorks||""}</div>
        </div>

        {dataPoints.length>0&&<div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <p style={{...h2,margin:0}}>Key Data Points</p>
            <span style={{fontSize:11,color:MUTED}}>Sorted by relevance</span>
          </div>
          {dataPoints.map((dp,i)=><div key={i} style={{marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${BORDER}`}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{minWidth:44,height:44,background:"#fff5f4",borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:"1px solid #ffd5d3"}}>
                <div style={{fontSize:15,fontWeight:900,color:RED,lineHeight:1}}>{dp.index||0}</div>
                <div style={{fontSize:9,color:MUTED,textTransform:"uppercase",marginTop:1}}>idx</div>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:700,color:TEXT}}>{dp.label||""}</span>
                  <span style={{fontSize:11,color:MUTED,background:"#f5f5f5",padding:"2px 7px",borderRadius:3,border:`1px solid ${BORDER}`}}>{dp.publication||""}{dp.pct?` · ${dp.pct}%`:""}</span>
                </div>
                <IndexBar idx={dp.index||0} color={RED}/>
                <div style={{fontSize:12,color:"#555",marginTop:6,lineHeight:1.5}}>{dp.insight||""}</div>
              </div>
            </div>
          </div>)}
        </div>}

        {pitchReport.competitiveEdge&&<div style={{...card,background:"#f5fdf6",borderColor:"#b6e8bc",borderLeft:"4px solid #16a34a"}}>
          <p style={{...h3,color:"#16a34a"}}>Mercury's Competitive Edge</p>
          <div style={{fontSize:13,color:"#333",lineHeight:1.7}}>{pitchReport.competitiveEdge}</div>
        </div>}

        <div style={card}>
          <p style={{...h2,margin:"0 0 14px"}}>📰 Recent Portland Market News</p>
          {newsLoading&&<div style={{color:MUTED,fontSize:13}}>⏳ Searching for relevant Portland news…</div>}
          {!newsLoading&&newsItems!==null&&news.length===0&&<div style={{color:MUTED,fontSize:13}}>No recent news found for this category.</div>}
          {!newsLoading&&news.map((item,i)=><div key={i} style={{marginBottom:14,paddingBottom:14,borderBottom:i<news.length-1?`1px solid ${BORDER}`:"none"}}>
            <div style={{fontWeight:700,fontSize:13,color:TEXT,marginBottom:3}}>{item.headline||""}</div>
            {item.source&&<div style={{fontSize:11,color:MUTED,marginBottom:4}}>{item.source}</div>}
            <div style={{fontSize:12,color:"#444",lineHeight:1.5,marginBottom:4}}>{item.summary||""}</div>
            {item.relevance&&<div style={{fontSize:12,color:"#16a34a",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:4,padding:"4px 8px",display:"inline-block"}}>💡 {item.relevance}</div>}
          </div>)}
        </div>

        {pitchReport.pitchNarrative&&<div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <p style={{...h2,margin:0}}>Ready-to-Deliver Pitch</p>
            <button style={btn("secondary")} onClick={()=>{navigator.clipboard.writeText(pitchReport.pitchNarrative);setCopied(true);setTimeout(()=>setCopied(false),2000);}}>
              {copied?"✓ Copied!":"📋 Copy"}
            </button>
          </div>
          <div style={{fontSize:14,lineHeight:1.8,color:TEXT,fontStyle:"italic",borderLeft:`3px solid ${RED}`,paddingLeft:16}}>{pitchReport.pitchNarrative}</div>
        </div>}

        {objections.length>0&&<div style={card}>
          <p style={h2}>Objection Handlers</p>
          {objections.map((o,i)=><div key={i} style={{marginBottom:14,paddingBottom:14,borderBottom:i<objections.length-1?`1px solid ${BORDER}`:"none"}}>
            <div style={{fontSize:12,color:MUTED,marginBottom:5,background:"#f9f9f9",padding:"6px 10px",borderRadius:4}}>❓ {o.objection||""}</div>
            <div style={{fontSize:13,color:TEXT,lineHeight:1.6,paddingLeft:4}}>💬 {o.response||""}</div>
          </div>)}
        </div>}

        <button style={btn("secondary")} onClick={()=>{
          const full=`PITCH REPORT\n\n${pitchReport.headline||""}\n\n${pitchReport.whyItWorks||""}\n\nKEY DATA:\n${dataPoints.map(d=>`• ${d.label} — Index: ${d.index} (${d.publication})\n  ${d.insight}`).join("\n")}\n\nPITCH:\n${pitchReport.pitchNarrative||""}\n\nOBJECTION HANDLERS:\n${objections.map(o=>`Q: ${o.objection}\nA: ${o.response}`).join("\n\n")}`;
          navigator.clipboard.writeText(full);setCopied(true);setTimeout(()=>setCopied(false),2000);
        }}>📋 Copy Full Report</button>
      </div>}
    </div>;
  }

  // ─── UPLOAD ───
  function UploadTab(){
    return <div>
      <div style={card}>
        <p style={h2}>Add Competitor Reports</p>
        <p style={{color:MUTED,fontSize:13,marginTop:-10,marginBottom:16}}>Mercury and Willamette Week are pre-loaded. Upload competitor PDFs to add more.</p>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:6,marginBottom:16}}>
          <span style={{fontSize:18}}>✓</span>
          <div><div style={{color:"#15803d",fontWeight:700,fontSize:13}}>Portland Mercury · Willamette Week · The Oregonian — Pre-loaded</div>
            <div style={{color:MUTED,fontSize:12}}>Winter 2025 · All data extracted and ready</div></div>
        </div>
        <p style={{...h3}}>Upload Competitor PDFs ({comps.filter(c=>c.id!=="ww_preloaded"&&c.id!=="oregonian_preloaded").length}/5)</p>
        <div onClick={()=>compRef.current.click()} style={{border:`2px dashed ${BORDER}`,borderRadius:8,padding:"28px 20px",textAlign:"center",cursor:"pointer",background:"#fafafa"}}>
          <div style={{fontSize:28,marginBottom:8}}>📄</div>
          <div style={{fontSize:14,color:TEXT,fontWeight:600}}>Click to upload a competitor PDF</div>
          <div style={{fontSize:12,color:MUTED,marginTop:4}}>Claude extracts all index data automatically</div>
        </div>
        <input ref={compRef} type="file" accept=".pdf" style={{display:"none"}} onChange={e=>{if(e.target.files[0])processPDF(e.target.files[0]);e.target.value="";}}/>
        {comps.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:14}}>
          {comps.map((c,i)=><div key={c.id} style={{background:"#f5f5f5",border:`1px solid ${BORDER}`,borderRadius:5,padding:"6px 12px",display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:COLORS[(i+1)%COLORS.length],display:"inline-block"}}/>
            <span style={{fontSize:13}}>{c.publicationName}</span>
            {c.id!=="ww_preloaded"&&c.id!=="oregonian_preloaded"&&<button onClick={()=>setPubs(p=>p.filter(x=>x.id!==c.id))} style={{background:"none",border:"none",color:"#aaa",cursor:"pointer",fontSize:16,padding:0}}>×</button>}
          </div>)}
        </div>}
      </div>
      <div style={card}>
        <p style={h2}>💾 Save & Restore Session</p>
        <p style={{color:MUTED,fontSize:13,marginTop:-10,marginBottom:16}}>Export parsed data so reps can reload without re-uploading PDFs.</p>
        <div style={{display:"flex",gap:10}}>
          <button style={btn("primary")} onClick={exportJSON}>⬇ Export JSON</button>
          <button style={btn("secondary")} onClick={()=>jsonRef.current.click()}>⬆ Import JSON</button>
          <input ref={jsonRef} type="file" accept=".json" style={{display:"none"}} onChange={importJSON}/>
        </div>
      </div>
      {err&&<div style={{...card,borderColor:RED,color:"#dc2626",fontSize:13}}>⚠ {err}</div>}
    </div>;
  }

  return <div style={{background:BG,minHeight:"100vh",color:TEXT,fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",paddingBottom:60}}>
    <div style={{background:"#fff",borderBottom:`3px solid ${RED}`,padding:"14px 24px",display:"flex",alignItems:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
      <div>
        <div style={{color:RED,fontWeight:900,fontSize:16,letterSpacing:"0.05em"}}>PORTLAND MERCURY</div>
        <div style={{color:MUTED,fontSize:12,marginTop:1}}>Media Audit Tool · Sales Rep Edition · Winter 2025</div>
      </div>
      <div style={{marginLeft:"auto",display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
        {pubs.map((p,i)=><span key={p.id} style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:3,background:p.isMercury?RED:"#f0eeee",color:p.isMercury?"#fff":"#555",border:`1px solid ${p.isMercury?RED:"#ddd"}`}}>{p.isMercury?"★ ":""}{p.publicationName.split(" ").slice(0,3).join(" ")}</span>)}
      </div>
    </div>
    <div style={{display:"flex",background:"#fff",borderBottom:`1px solid ${BORDER}`,padding:"0 20px",overflowX:"auto",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      {TABS.map(t=><div key={t.id} onClick={()=>!t.locked&&setTab(t.id)} style={{padding:"12px 16px",fontSize:13,fontWeight:tab===t.id?700:400,color:tab===t.id?RED:t.locked?"#ccc":MUTED,borderBottom:tab===t.id?`2px solid ${RED}`:"2px solid transparent",cursor:t.locked?"default":"pointer",whiteSpace:"nowrap"}}>{t.label}</div>)}
    </div>
    {loading&&<div style={{position:"fixed",inset:0,background:"rgba(255,255,255,0.9)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{...card,textAlign:"center",padding:40,maxWidth:300}}>
        <div style={{fontSize:36,marginBottom:12}}>⏳</div>
        <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>Processing PDF</div>
        <div style={{fontSize:13,color:MUTED}}>{loadMsg}</div>
      </div>
    </div>}
    <div style={{padding:24,maxWidth:1000,margin:"0 auto"}}>
      {tab==="profile"&&ProfileTab()}
      {tab==="compare"&&CompareTab()}
      {tab==="search"&&SearchTab()}
      {tab==="pitch"&&PitchTab()}
      {tab==="upload"&&UploadTab()}
    </div>
  </div>;
}
