using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Entities.FilterEntities;

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
                .UsingEntity(x => x.ToTable("tbl_AdvertFilterValues"));
        }
    }
}
