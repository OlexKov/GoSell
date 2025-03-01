using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Olx.BLL.Entities.NewPost;

namespace Olx.DAL.Data.EntityConfigs.NewPost
{
    public class AreaConfig : IEntityTypeConfiguration<Area>
    {
        public void Configure(EntityTypeBuilder<Area> builder)
        {
            builder.HasMany(x => x.Regions)
                .WithOne(x => x.Area)
                .HasForeignKey(x => x.AreaRef)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
