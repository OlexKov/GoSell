using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Olx.BLL.Entities.NewPost;

namespace Olx.DAL.Data.EntityConfigs.NewPost
{
    public class RegionConfig : IEntityTypeConfiguration<Region>
    {
        public void Configure(EntityTypeBuilder<Region> builder)
        {
            builder.HasMany(x => x.Settlements)
                .WithOne(x => x.SettlementRegion)
                .HasForeignKey(x => x.Region)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
