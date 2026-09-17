export const mapFirestoreData = function<T,K>(data:T[], fun: (p:T) => K){
    return data      
      .map((msg) => {

        return fun(msg)
         
      })
  }