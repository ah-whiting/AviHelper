// /**
//  * @param {number[][]} buildings
//  * @return {number[][]}
//  */
// var getSkyline = function(buildings) {
//     let ans = [];
    
//     class Build {
//         constructor(height, right, left) {
//             this.h = height;
//             this.r = right;
//             this.l = left
//             this.next = null;
//         }
//     }
//     class BuildSLL {
//         constructor() {
//             this.head = null;
//             this.tail = null;
//         }
//         addBuild(height, right, left) {
//             let newNode = new Build(height, right, left);
//             let runner = this.head;
//             if(runner.h < newNode.h) {
//                 newNode.next = runner;
//                 this.head = newNode;
//                 return;
//             }
//             while(runner.next != null && runner.next.h > runner.h) {
//                 runner = runner.next;
//             }
//             let temp = runner.next;
//             runner.next = newNode;
//             newNode.next = temp;
//         }
//         findSkyline(position) {
//             let runner = this.head;
//             while(
//                 runner.next != null &&
//                 runner.r <= position ||
//                 runner.l > position 
//                   ) {
//                 runner = runner.next;
//             }
//             this.head = runner;
//             return this.head;
//         }
//     }
    
//     let skyline = new BuildSLL();
//     let ground = new Build(0, Number.MAX_VALUE, 0);
//     skyline.head = ground;
    
//     let cHeight = 0;
//     let nBuild;
//     let pBuild = ground;
//     let b = buildings;
    
//     for(let i = 0; i < b.length; i++) {
//         if(b[i][2] > cHeight) {
//             cHeight = b[i][2];
//             ans.push([b[i][0], cHeight])
//             skyline.addBuild(cHeight, b[i][1], b[i][0])
//         }
//         else if(b[i][2] == cHeight) {
//             skyline.addBuild(b[i][2], b[i][1], b[i][0])
//             continue;
//         }
//         else {
//             skyline.addBuild(b[i][2], b[i][1], b[i][0]);
//             nBuild = skyline.findSkyline(pBuild[1]);
//             ans.push([pBuild[1], nBuild.h]);
//             cHeight = nBuild.h;
//         }
//         pBuild = b[i];
//     }
//     return ans;
    
// };

// getSkyline([[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]);


var maxDepth = function(root) {
    let ans;
    function dfs(node = root, countArr = [0], count = 0) {
        if(!node) {
            return;
        }
        count++;
        if(count > countArr[0]) {
            countArr[0] = count;
            ans = count;
        }
        dfs(node.left, arr, count);
        dfs(node.right, arr, count);
        return arr;
    }
    return ans;
};