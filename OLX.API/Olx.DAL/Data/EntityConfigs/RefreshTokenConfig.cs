using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Olx.BLL.Entities;

namespace Olx.DAL.Data.EntityConfigs
{
    public class RefreshTokenConfig : IEntityTypeConfiguration<RefreshToken>
    {
        public void Configure(EntityTypeBuilder<RefreshToken> builder)
        {
            builder.HasOne(x => x.OlxUser)
                .WithMany(x => x.RefreshTokens)
                .HasForeignKey(x => x.OlxUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
