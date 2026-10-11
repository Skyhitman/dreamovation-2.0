import re

print("Updating index.html with runtime contract hooks and extension scripts...")

with open("d:/dreamovation 2.0/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Hook emitRuntimeEvent into pickObj
pickobj_old = """function pickObj(id){const m=sim.objs.find(o=>o.userData.id==id);if(!m)return;if(sim.busy&&sim.busy())return;if(INF[id])tip(INF[id]);"""
pickobj_new = """function pickObj(id){const m=sim.objs.find(o=>o.userData.id==id);if(!m)return;if(sim.busy&&sim.busy())return;if(INF[id])tip(INF[id]);if(window.emitRuntimeEvent)emitRuntimeEvent(id,'interact',st?st.phase:'basic','SUCCESS','Interacted with '+(INF[id]||id));"""

if pickobj_old in html:
    html = html.replace(pickobj_old, pickobj_new, 1)
    print("Hooked emitRuntimeEvent into pickObj")
else:
    print("Warning: pickobj_old pattern not matched exactly, checking regex...")
    html = re.sub(
        r'function pickObj\(id\)\{const m=sim\.objs\.find\(o=>o\.userData\.id==id\);if\(!m\)return;if\(sim\.busy&&sim\.busy\(\)\)return;if\(INF\[id\]\)tip\(INF\[id\]\);',
        pickobj_new,
        html,
        count=1
    )

# 2. Hook emitRuntimeEvent into mist
mist_old = """function mist(t,title,why,fix){
  st.mist.push(t);
  hud();"""
mist_new = """function mist(t,title,why,fix){
  st.mist.push(t);
  if(window.emitRuntimeEvent)emitRuntimeEvent(t,'safety_violation',st?st.phase:'basic','CRITICAL_GATE_TRIGGERED',title+': '+why);
  hud();"""

if mist_old in html:
    html = html.replace(mist_old, mist_new, 1)
    print("Hooked emitRuntimeEvent into mist")
else:
    html = re.sub(
        r'function mist\(t,title,why,fix\)\{\s*st\.mist\.push\(t\);\s*hud\(\);',
        mist_new,
        html,
        count=1
    )

# 3. Hook Telemetry Stream HUD into startSim
startsim_old = """function startSim(){go('sim');st={haz:new Set,pick:new Set,worn:0,ident:0,iso:0,ver:0,tool:0,maint:0,insp:0,rest:0,mist:[],t0:Date.now(),phase:'basic',inZone:0,em:null,hints:0};
 const cv=$('#cv'),sw=$('#sw')"""

startsim_new = """function startSim(){go('sim');st={haz:new Set,pick:new Set,worn:0,ident:0,iso:0,ver:0,tool:0,maint:0,insp:0,rest:0,mist:[],t0:Date.now(),phase:'basic',inZone:0,em:null,hints:0};
 const cv=$('#cv'),sw=$('#sw');
 if(sw&&!document.getElementById('telemetry-contract-hud')){
   const th=document.createElement('div');
   th.id='telemetry-contract-hud';
   th.innerHTML=`<div class="telemetry-hud-hdr" onclick="this.parentElement.classList.toggle('collapsed')"><span>📡 RUNTIME EVENT CONTRACT</span><small style="font-size:9px;color:#38bdf8">▼ Toggle</small></div><div class="telemetry-hud-list" id="telemetry-hud-list"><div class="telemetry-item"><span style="color:#38bdf8">[SESSION INIT]</span> Runtime Event Stream Active · Three.js</div></div>`;
   sw.appendChild(th);
 }"""

if startsim_old in html:
    html = html.replace(startsim_old, startsim_new, 1)
    print("Hooked Telemetry HUD into startSim")
else:
    html = re.sub(
        r"function startSim\(\)\{go\('sim'\);st=\{haz:new Set,pick:new Set,worn:0,ident:0,iso:0,ver:0,tool:0,maint:0,insp:0,rest:0,mist:\[\],t0:Date\.now\(\),phase:'basic',inZone:0,em:null,hints:0\};\s*const cv=\$\('#cv'\),sw=\$\('#sw'\)",
        startsim_new,
        html,
        count=1
    )

# 4. Insert script tags for platform_extension.js and views_extension.js right before </body>
script_tags = """
<script src="platform_extension.js"></script>
<script src="views_extension.js"></script>
"""

if '<script src="platform_extension.js"></script>' not in html:
    html = html.replace('</body>', script_tags + '\n</body>')
    print("Injected script tags for platform_extension.js and views_extension.js")

with open("d:/dreamovation 2.0/index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Saved updated index.html successfully.")
