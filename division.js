function permute(str, ret, l = 0, r = str.length-1) {
    if(l === r) ret.push(str.join(''));
    else {
        for(let i=l; i<=r; i++) {
            swap(str, l, i);
            permute(str, ret, l+1, r);
            swap(str, l, i); 
        }
    }
}
 
function permuteR(str, ret, r, n = str.length, depth = 0) {
    if(depth === r) ret.push(str.join(''));
    else {
        for(let i=depth; i<n; i++) {
            swap(str, i, depth);
            permuteR(str, ret, r, n, depth+1);
            swap(str, i, depth); 
        }
    }
}
 
function k_combinations(set, k,  unselected, sameset = set, originK = k) {
    let i, j, combs, head, tailcombs;
    let data;
    let uns;
    
    if (k > set.length || k <= 0) 
        return [];
    
    if (k == set.length) 
        return [set];
    
    if (k == 1) {
        combs = [];
        for (i = 0; i < set.length; i++) 
            combs.push([set[i]]);
        return combs;
    }
 
    combs = [];
 
    for (i = 0; i < set.length - k + 1; i++) {
        head = set.slice(i, i + 1);
        tailcombs = k_combinations(set.slice(i + 1), k - 1, unselected, set, originK);
        for (j = 0; j < tailcombs.length; j++) {
            uns = [];
            if(tailcombs[j].length > 1 && typeof tailcombs[j] === 'string')
                data = head.concat(tailcombs[j].split(''))
            else 
                data = head.concat(tailcombs[j]);
            combs.push(data.join(''));          
            
            data = sameset.filter((el, idx, arr) => {
                for(let i=0; i<data.length; i++) 
                    if(data[i] === el) return false; 
                return true;
            });
            // data = data.map((el, idx, arr) => parseInt(el));
            uns.push(data.join(''));
 
            if(combs[combs.length-1].length === originK) {
                // console.log(`  selected : ${combs[combs.length-1]}`);
                // console.log(`unselected : ${uns[uns.length-1]}`);
                unselected.push(uns[uns.length-1]);
            }
        }
    }
    return combs;
}
 
function swap(arr,a,b) {
    // xor swap 하면 원본데이터 꺠질 수 있음.
    let temp = arr[a]; 
    arr[a] = arr[b];
    arr[b] = temp;    
}
 
function equal(a,b) {
    let cnt = 0;
    let temp = [];
 
    for(let i=0; i<b.length; i++) {
        temp = [];
        permute(b[i].map( (el, idx, arr) => String(el))   , temp);
        if(temp.indexOf(a.join('')) >= 0) return true;
    }
    return false;
}
 
// 서로 같은게 몇개나있는지
function countingSameValue(arr) {
    let largest = 0;
    let cnt = 0;
 
    for(let i=0; i<arr.length; i++) {
        largest = cnt > largest ? cnt : largest;
        cnt = 0;
 
        for(let j=0; j<arr.length; j++) 
            if(arr[i] === arr[j]) cnt++;
    }
    return largest;
}
 
function factorial(num) {
    if(num == 0) return 1;
    else return num * factorial(num -1);
}
 
function generateEmptyArray(num) {
    return new Array(num);
}
 
function devide(a,b,ret = [], temp = [], backupRet = undefined, idx = 0, add = 0, init = false, exit = 0) {
    if(idx+1 > b-1 && temp[0] === 1) {
        console.log("완전종료")
        return;
    }
    if(ret.length) {
        if(ret[ret.length-1] === backupRet) exit++;
        backupRet = ret[ret.length-1];
    }
    if(exit > 50) {
        console.log("완전종료");
        return;
    }
 
 
    for(let i=0; i<temp.length; i++) {
        if(temp[i] <= 0) {
            temp[idx] += add;
            temp[idx+1] -= add;
            idx = 0;
            add = 0;
            temp[idx]--;
            temp[idx+1]++;
            devide(a,b,ret,temp,backupRet,idx,add,init,exit);
            return;
        }
    }
 
    if(idx+1 > b-1) {
        temp = ret[ret.length-1].slice();
        add = 0;
        idx = 0;
        temp[idx]--;
        temp[idx+1]++;
        devide(a,b,ret,temp,backupRet,idx,add,init,exit);
    } else {
        let flag = true;
 
        if(!init) {
            temp[0] = a-b+1;
            for(let i=1; i<b; i++)
                temp[i] = 1;
            ret.push(temp.slice());
            init = !init;
        } else {
            for(let i=0; i<temp.length; i++) {
                if(temp[i] <= 0) {
                    flag = false;
                    break;
                }
            }
            if(!equal(temp,ret) && flag) ret.push(temp.slice());   
        }
        add = temp[idx+1] - temp[idx];
        temp[idx+1] = temp[idx];
        temp[idx+2] += add;
        idx++;
        devide(a,b,ret,temp,backupRet,idx,add,init,exit);
    }
}
 
function divideArrIntoSeveral(arr,n) {
    const len = arr.length;
    const cnt = Math.floor(len/n) + (Math.floor(len%n) > 0 ? 1 : 0);
    const temp = [];
 
    for(let i=0; i<cnt; i++) temp.push(arr.splice(0,n));
    return temp;
}
 
// 2개로 나눌수있을때만 쓸수있음
function divisionAndExtractNumberOfCases(strArr,divisionNum) {
    let selected = [];
    let unselected = [];
    let divisionArr = [];
    let ret = [];
    let final = [];
    let smaeCnt;
    let nCr1, nCr2;
    let loopCnt;
    
    devide(strArr.length, divisionNum, divisionArr);
    for(let i=0; i<divisionArr.length; i++) {
        selected = k_combinations(strArr, divisionArr[i][0], unselected);
    
        sameCnt = countingSameValue(divisionArr[i]);
        nCr1 = k_combinations(generateEmptyArray(strArr.length),selected[0].length,[]).length;  
        if(sameCnt > 1) {
            nCr2 = k_combinations(generateEmptyArray(selected[0].length),selected[0].length,[]).length;  
            loopCnt = (nCr1 * nCr2) / factorial(sameCnt);
        } else 
            loopCnt = nCr1;
 
 
        for(let j=0; j<loopCnt; j++) {
            final = [];
            for(let k=1; k<divisionArr[i].length; k++)
                final.push(divideArrIntoSeveral([unselected[j]], divisionArr[i][k])[0]);
            ret.push([selected[j], final.join(',')]);
        }
        unselected = [];
    }
    return ret;
}



