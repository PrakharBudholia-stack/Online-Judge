function solution() {
    const readline = require("readline");

    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    });

    rl.on("line", (line) => {
        const inputData = parseInt(line);
        if(inputData%2==0)
            console.log("Even");
        else
            console.log("Odd")
    });

    let x=line;
    
  return 0;
}

solution()