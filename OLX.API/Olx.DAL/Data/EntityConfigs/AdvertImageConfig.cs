using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Olx.BLL.Entities;

namespace Olx.DAL.Data.EntityConfigs
{
    public class AdvertImageConfig : IEntityTypeConfiguration<AdvertImage>
    {
        public void Configure(EntityTypeBuilder<AdvertImage> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Advert)
                .WithMany(x => x.Images)
                .HasForeignKey(x => x.AdvertId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
