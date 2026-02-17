/* GLOBAL CONFIG */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background-color: #0d0d1a; color: #f8fafc; line-height: 1.6; }
.application-wrapper { max-width: 1100px; margin: 0 auto; padding: 20px; }

/* HEADER & STATS */
.app-header { background: linear-gradient(135deg, #4338ca, #7e22ce); padding: 30px; border-radius: 12px; margin-bottom: 20px; }
.header-main { display: flex; justify-content: space-between; align-items: center; }
.stat-item { background: rgba(0,0,0,0.3); padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-left: 10px; display: inline-block; }

/* NAVIGATION */
.tab-navigation { display: flex; gap: 10px; margin-bottom: 20px; }
.nav-tab { flex: 1; padding: 16px; background: #1e1e35; border: none; color: #94a3b8; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.3s; }
.nav-tab.active { background: #4338ca; color: white; }

/* TIER SELECTOR */
.tier-nav { display: flex; gap: 10px; margin-bottom: 25px; }
.tier-link { padding: 10px 24px; background: transparent; border: 2px solid #334155; color: #94a3b8; border-radius: 8px; cursor: pointer; font-weight: bold; }
.tier-link.active { border-color: #4338ca; color: #4338ca; background: rgba(67, 56, 202, 0.1); }

/* LAYOUT GRIDS */
.panel { display: none; background: #1e1e35; padding: 30px; border-radius: 12px; min-height: 500px; }
.panel.active { display: block; }
.topic-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }

.topic-card { background: #2a2a4a; padding: 25px; border-radius: 12px; border: 2px solid transparent; transition: 0.3s; display: flex; flex-direction: column; justify-content: space-between; }
.topic-card:hover { border-color: #4338ca; transform: translateY(-3px); }

/* QUESTION INTERFACE */
.question-box { background: #2a2a4a; padding: 40px; border-radius: 12px; margin-top: 20px; }
.input-row { display: flex; gap: 15px; margin: 25px 0; align-items: center; }
.input-row input { flex: 1; padding: 15px; border-radius: 8px; border: 1px solid #444; background: #0d0d1a; color: white; font-size: 1.2rem; }
.unit-label { font-weight: bold; color: #a855f7; }

.btn-cta { background: #4338ca; color: white; border: none; padding: 12px 28px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.2s; }
.btn-cta:hover { background: #3730a3; }

.import-flex { display: flex; gap: 10px; margin: 15px 0; }
.import-flex input { flex: 1; padding: 12px; border-radius: 6px; border: 1px solid #444; background: #0d0d1a; color: white; }
