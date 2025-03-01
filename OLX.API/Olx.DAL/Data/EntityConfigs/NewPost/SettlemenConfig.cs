using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Entities.NewPost;

namespace Olx.DAL.Data.EntityConfigs.NewPost
{
    public class SettlementConfig : IEntityTypeConfiguration<Settlement>
    {
        public void Configure(EntityTypeBuilder<Settlement> builder)
        {
            builder.Property(x => x.Region)
                .HasConversion(v => string.IsNullOrWhiteSpace(v) ? null : v,v => v);
            builder.HasMany(x => x.Warehouses)
                .WithOne(x => x.Settlement)
                .HasForeignKey(x => x.SettlementRef)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(x => x.Adverts)
               .WithOne(x => x.Settlement)
               .HasForeignKey(x => x.SettlementRef);
        }
    }
}
