using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Olx.BLL.Entities;

namespace Olx.DAL.Data.EntityConfigs
{
    public class UserConfig : IEntityTypeConfiguration<OlxUser>
    {
        public void Configure(EntityTypeBuilder<OlxUser> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasMany(x => x.Adverts)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(x => x.FavoriteAdverts)
                .WithMany(x => x.FavoritedByUsers)
                .UsingEntity(x => x.ToTable("tbl_UserFavorites"));

            builder.HasMany(x => x.BuyChats)
                .WithOne(x => x.Seller)
                .HasForeignKey(x=>x.SellerId);
            builder.HasMany(x => x.SellChats)
                .WithOne(x => x.Buyer)
                .HasForeignKey(x => x.BuyerId);
            builder.HasMany(x => x.ChatMessages)
                .WithOne(x => x.Sender)
                .HasForeignKey(x => x.SenderId);
            builder.HasMany(x => x.AdminMessages)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Settlement)
                .WithMany(x => x.Users)
                .HasForeignKey(x => x.SettlementRef);

        }
    }
}
