using Ardalis.Specification;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Data;
using System.Linq.Expressions;

namespace Olx.BLL.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<IDbContextTransaction> BeginTransactionAsync(IsolationLevel isolationLevel);
        IQueryable<TEntity> GetQuery(QueryTrackingBehavior tracking = QueryTrackingBehavior.NoTracking);
        Task<TEntity?> GetByIDAsync(object id);
        Task<bool> AnyAsync();
        Task<bool> AnyAsync(Expression<Func<TEntity, bool>> exp);
        Task<int> CountAsync(Expression<Func<TEntity, bool>> exp);
        Task<int> CountAsync();
        Task AddAsync(TEntity entity);
        Task AddRangeAsync(IEnumerable<TEntity> entities);
        void Delete(object id);
        Task DeleteAsync(object id);
        void DeleteRange(IEnumerable<TEntity> entities);
        void Delete(TEntity entityToDelete);
        void Update(TEntity entityToUpdate);
        Task SaveAsync();
        Task<TEntity?> GetItemBySpec(ISpecification<TEntity> specification);
        Task<IEnumerable<TEntity>> GetListBySpec(ISpecification<TEntity> specification);
    }
}
