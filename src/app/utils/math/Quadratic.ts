export const Quadratic = (a:number) => (b:number) => (c:number) => {
    
    const root_part = Math.sqrt(b * b - 4 * a * c);
    const denom = 2 * a;
 
    const root1 = ( -b + root_part ) / denom;
    const root2 = ( -b - root_part ) / denom;

    return [root1, root2]; 
}
