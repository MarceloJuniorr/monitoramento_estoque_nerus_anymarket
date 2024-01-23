import { read, utils } from 'xlsx';
import  {inserirProdutosAny, truncatePrdany}  from './queryController.js'

async function processarPlanilhaAny(buffer) {
    const workbook = read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    console.log(sheetName);
    const produtos = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { raw: false });
    truncatePrdany();
    for (const produto of produtos) {
      console.log('PRODUTOS:' , produto);
      inserirProdutosAny(produto)
      
    }
  
    return (produtos);
  }

  export { processarPlanilhaAny };
