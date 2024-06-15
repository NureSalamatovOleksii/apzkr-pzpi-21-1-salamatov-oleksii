﻿// <auto-generated />
using System;
using DAL.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace DAL.Migrations
{
    [DbContext(typeof(SmartRecyclingDbContext))]
    partial class SmartRecyclingDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.18")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("CORE.Models.CollectionPoint", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Fullness")
                        .HasColumnType("int");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("CollectionPoint");
                });

            modelBuilder.Entity("CORE.Models.CollectionPointComposition", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CollectionPointID")
                        .HasColumnType("int");

                    b.Property<int>("Fullness")
                        .HasColumnType("int");

                    b.Property<int>("MaxVolume")
                        .HasColumnType("int");

                    b.Property<string>("TrashType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Volume")
                        .HasColumnType("int");

                    b.Property<int>("Weight")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CollectionPointID");

                    b.ToTable("CollectionPointComposition");
                });

            modelBuilder.Entity("CORE.Models.CollectionPointStatistics", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Attendance")
                        .HasColumnType("int");

                    b.Property<int>("Collected")
                        .HasColumnType("int");

                    b.Property<int>("CollectionPointID")
                        .HasColumnType("int");

                    b.Property<string>("MostCollectedType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Period")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Recycled")
                        .HasColumnType("int");

                    b.Property<int?>("RecyclingPointId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CollectionPointID");

                    b.HasIndex("RecyclingPointId");

                    b.ToTable("CollectionPointStatistics");
                });

            modelBuilder.Entity("CORE.Models.Operation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CollectionPointID")
                        .HasColumnType("int");

                    b.Property<DateTimeOffset>("Time")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("TrashType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserID")
                        .HasColumnType("int");

                    b.Property<int>("Volume")
                        .HasColumnType("int");

                    b.Property<int>("Weight")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CollectionPointID");

                    b.HasIndex("UserID");

                    b.ToTable("Operation");
                });

            modelBuilder.Entity("CORE.Models.RecyclingPoint", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Capacity")
                        .HasColumnType("int");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ProcessingTrash")
                        .HasColumnType("int");

                    b.Property<int>("QueuedTrash")
                        .HasColumnType("int");

                    b.Property<string>("RecyclingType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Workload")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("RecyclingPoint");
                });

            modelBuilder.Entity("CORE.Models.Transportation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CollectionPointID")
                        .HasColumnType("int");

                    b.Property<int>("RecyclingPointID")
                        .HasColumnType("int");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TrashType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Weight")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CollectionPointID");

                    b.HasIndex("RecyclingPointID");

                    b.ToTable("Transportation");
                });

            modelBuilder.Entity("CORE.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ConfirmationCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsEmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Surname")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("User");
                });

            modelBuilder.Entity("CORE.Models.UserStatistics", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("int");

                    b.Property<int>("Bonuses")
                        .HasColumnType("int");

                    b.Property<int>("Recycled")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("UserStatistics");
                });

            modelBuilder.Entity("CORE.Models.CollectionPointComposition", b =>
                {
                    b.HasOne("CORE.Models.CollectionPoint", "CollectionPoint")
                        .WithMany("CollectionPointComposition")
                        .HasForeignKey("CollectionPointID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CollectionPoint");
                });

            modelBuilder.Entity("CORE.Models.CollectionPointStatistics", b =>
                {
                    b.HasOne("CORE.Models.CollectionPoint", "CollectionPoint")
                        .WithMany("CollectionPointStatistics")
                        .HasForeignKey("CollectionPointID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CORE.Models.RecyclingPoint", null)
                        .WithMany("RecyclingPointStatistics")
                        .HasForeignKey("RecyclingPointId");

                    b.Navigation("CollectionPoint");
                });

            modelBuilder.Entity("CORE.Models.Operation", b =>
                {
                    b.HasOne("CORE.Models.CollectionPoint", "CollectionPoint")
                        .WithMany("Operations")
                        .HasForeignKey("CollectionPointID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CORE.Models.User", "User")
                        .WithMany("Operations")
                        .HasForeignKey("UserID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CollectionPoint");

                    b.Navigation("User");
                });

            modelBuilder.Entity("CORE.Models.Transportation", b =>
                {
                    b.HasOne("CORE.Models.CollectionPoint", "CollectionPoint")
                        .WithMany("Transportations")
                        .HasForeignKey("CollectionPointID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("CORE.Models.RecyclingPoint", "RecyclingPoint")
                        .WithMany("Transportation")
                        .HasForeignKey("RecyclingPointID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CollectionPoint");

                    b.Navigation("RecyclingPoint");
                });

            modelBuilder.Entity("CORE.Models.UserStatistics", b =>
                {
                    b.HasOne("CORE.Models.User", "User")
                        .WithOne("UserStatistics")
                        .HasForeignKey("CORE.Models.UserStatistics", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("CORE.Models.CollectionPoint", b =>
                {
                    b.Navigation("CollectionPointComposition");

                    b.Navigation("CollectionPointStatistics");

                    b.Navigation("Operations");

                    b.Navigation("Transportations");
                });

            modelBuilder.Entity("CORE.Models.RecyclingPoint", b =>
                {
                    b.Navigation("RecyclingPointStatistics");

                    b.Navigation("Transportation");
                });

            modelBuilder.Entity("CORE.Models.User", b =>
                {
                    b.Navigation("Operations");

                    b.Navigation("UserStatistics");
                });
#pragma warning restore 612, 618
        }
    }
}
