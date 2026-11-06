const fs=require('fs');const a=JSON.parse(fs.readFileSync(process.argv[2])),b=JSON.parse(fs.readFileSync(process.argv[3]));let d=0;
a.res.forEach((x,i)=>{const y=b.res[i];if(!y||x.img!==y.img||x.st!==y.st||x.err!==y.err){d++;console.log('DIF',x.name,x.img,y&&y.img,x.st,y&&y.st,x.err,y&&y.err)}});
console.log(d?d+' pasos distintos':'IDÉNTICOS: '+a.res.length+' pasos (imagen + estado)')
