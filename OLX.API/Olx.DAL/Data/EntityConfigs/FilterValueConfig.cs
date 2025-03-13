using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Entities.FilterEntities;
using Olx.BLL.Entities;

namespace Olx.DAL.Data.EntityConfigs
{
    public class FilterValueConfig : IEntityTypeConfiguration<FilterValue>
    {
        public void Configure(EntityTypeBuilder<FilterValue> builder)
        {
            builder.HasOne(x => x.Filter)
                .WithMany(x => x.Values)
                .HasForeignKey(x => x.FilterId);
              
            builder.HasMany(x => x.Adverts)
                .WithMany(x => x.FilterValues)
                .UsingEntity<Dictionary<string, object>>(
                "tbl_AdvertFilterValue",
                j => j.HasOne<Advert>().WithMany().HasForeignKey("AdvertId").OnDelete(DeleteBehavior.Cascade),
                j => j.HasOne<FilterValue>().WithMany().HasForeignKey("FilterValueId").OnDelete(DeleteBehavior.Cascade)
            );
                
        }
    }
}
