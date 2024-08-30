export function generateRandomGrowthData(startYear = 1970, numYears = 52) {
    const data = [];
    
    for (let i = 0; i < numYears; i++) {
      const year = startYear + i;
      const exportGrowthRate = parseFloat((Math.random() * 3 + 0.5).toFixed(2));
      const importGrowthRate = parseFloat((Math.random() * 3 + 0.5).toFixed(2));
      
      data.push({
        year: year,
        "Export Growth Rate": exportGrowthRate,
        "Import Growth Rate": importGrowthRate
      });
    }
    
    return data;
  }
  

