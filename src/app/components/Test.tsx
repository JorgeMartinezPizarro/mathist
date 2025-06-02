// @ts-nocheck
// TODO: fix the ts issues and remove this hack
const Test = () => {

    const a = []

    for (var i = 0; i<10;i++) {
        const b = []
        for (var j = 0; j<10;j++) {
            b.push(10*i + j + 1)
        }
        a.push(b)
    }

    const c = []

    for (var i = 2; i<1000;i++) {
        if (i % 2 !== 0 && i % 3 !== 0 && i % 5 !== 0)
            c.push(i)
    }

    const d: number[][] = []
    for (var i = 0; i<20;i++) {
        const b = []
        for (var j = 0; j<11;j++) {
            b.push(c[7*i + j])
        }
        d.push(b)
    }

    const f: number[] = []
    const g: number[] = []
    const h: number[] = []

    var r = {r7: f, r11: g, r13: h}
    for (var i = 0; i<c.length;i++){
        const x: number = c[i] || 0
        if (x % 7 === 0) {
            const lastElement7 = r.r7.length > 0 ? r.r7[r.r7.length - 1] : 1;
            

            r.r7.push(i + 1 - lastElement7)            
        }
        if (x % 11 === 0){
            const lastElement11 = r.r11.length > 0 ? r.r11[r.r11.length - 1] : 2;
            
            r.r11.push(i + 1 - lastElement11)            
        }
        if (x % 13 === 0){
            const lastElement13 = r.r13.length > 0 ? r.r13[r.r13.length - 1] : 3;
            r.r13.push(i + 1 - lastElement13)            
        }

    }


    
    const color = (x: number) => {
        if (x % 2 === 0)
            return "red"
        else if (x % 3 === 0)
            return "green"
        else if (x % 5 === 0)
            return "blue"
        else if (x % 7 === 0)
            return "gold"
        else if (x % 11 === 0)
            return "silver"
        else if (x % 13 === 0)
            return "yellow"
        else if (x % 17 === 0)
            return "orange"
        
        else
            return "white"   
    }

    return <div>
        <p>Eratosthenes sieve:</p>
        <table>
            <tbody>
                {a.map(b => <tr key={b.toString()}>{b.map(x => <td key={x} style={{padding: "8px", background: color(x)}}>{x}</td>)}</tr>)}
            </tbody>
        </table>
        <hr/>
        <p>Eratosthenes sieve without 2, 3 and 5:</p>
        <table>
            <tbody>
                {d.map(b => <tr key={b.toString()}>{b.map(x => <td key={x} style={{padding: "8px", background: color(x)}}>{x}</td>)}</tr>)}
            </tbody>
        </table>
        {Object.keys(r).map(k =>
            <p key={k}>{k}: {JSON.stringify(r[k])}</p>
        )}
    </div>
}


export default Test;