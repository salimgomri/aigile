# ⚡ Timing System - Quick Reference

## 📊 Status
- ✅ **146 activities** fully analyzed
- ✅ **4 timing phases** per activity  
- ✅ **108 coach notes** (74%)
- ✅ **Integrated in code**

## 📁 Files
```
lib/retro/activity-timings-data.json  (51K) - Raw data
lib/retro/activity-timings-data.ts    (52K) - TS export
lib/retro/activity-timings.csv        (11K) - CSV export
lib/retro/activity-timings.ts         (13K) - Utils
```

## 🚀 Quick Use
```typescript
import { ACTIVITY_TIMINGS_DATA } from '@/lib/retro/activity-timings-data'
const timing = ACTIVITY_TIMINGS_DATA['retromat-7']
```

## 📖 Full Docs
- TIMING_SYSTEM.md (8.5K) - Complete system
- TIMING_SUMMARY.md (8.4K) - Executive summary
- TIMING_ANALYSIS.md (10K) - Analysis guide

## 🎯 Key Stats
- Simple: 27 (18%) | Medium: 27 (18%) | Complex: 92 (64%)
- High scaling: 66 (45%) | Medium: 59 (40%) | Low: 21 (15%)

## 🔧 Regenerate
```bash
npx tsx scripts/generate-activity-timings.ts
```

---
**Coach Terrain** - 30 years experience | **March 2026** | **Production-ready** ✅
